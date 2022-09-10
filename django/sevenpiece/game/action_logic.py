from game.models import Piece, GameState, Player, Character
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError, IllegalPieceSelection
from game.game_logic import init_game, end_game
from game.support_logic import place_piece, is_current_turn, is_range_valid, move_piece, get_piece_by_location, remove_piece, take_damage

def make_move(piece_id, location, session, user):
    game_state = GameState.objects.get(session=session)
    board = game_state.map.data["data"]
    piece = Piece.objects.get(id=piece_id)
    player = Player.objects.get(user=user, game=game_state)
    if game_state.state == "PLACING":
        place_piece(piece, location, game_state, player.number)
        game_state.refresh_from_db()
        return game_state
    if game_state.state != "PLAYING":
        raise IllegalMoveError
    if not is_current_turn(game_state, user):
        print("Not your turn")
        raise IllegalMoveError
    if not is_range_valid(piece, location, board, 0, piece.speed):
        print("Out of range")
        raise IllegalMoveError
    if board[location[0]][location[1]] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
        print("Not a valid tile")
        raise IllegalMoveError
    move_piece(piece, location, game_state)
    game_state.refresh_from_db()
    return game_state

def select_pieces(user, session, pieces):
    game_state = GameState.objects.get(session=session)
    all_pieces = []
    if game_state.state != "READY":
        return IllegalPieceSelection
    if len(pieces) != game_state.map.num_characters:
        raise IllegalPieceSelection
    for piece in pieces:
        character = Character.objects.get(name=piece)
        all_pieces.append(Piece.objects.create(character=character, game=game_state, player=Player.objects.get(user=user, game=game_state)))
    if len(game_state.piece_set.all()) == game_state.map.num_characters * game_state.map.player_size:
        init_game(game_state)
    return all_pieces

def attack(game_state, location, user, piece_id):
    #check to make sure it isn't on their team
    if game_state.state != "PLAYING":
        raise IllegalMoveError
    piece = Piece.objects.get(id=piece_id)
    print("Attack: {}/{}".format(piece.attack, piece.character.attack))
    if not is_current_turn(game_state, user):
        print("Not your turn")
        raise IllegalMoveError
    if piece.attack == 0:
        print("No available attack")
        raise IllegalMoveError
    if not is_range_valid(piece, location, game_state.map.data["data"], piece.character.attack_range_min, piece.character.attack_range_max):
        print("Out of range")
        raise IllegalMoveError
    target_piece = get_piece_by_location(game_state, location)
    if target_piece:
        target_piece = take_damage(target_piece, piece.attack)
    else:
        print("No piece there")
        raise IllegalMoveError
    if target_piece.health <= 0:
        remove_piece(game_state, target_piece, piece)
    game_state.refresh_from_db()
    return game_state
    
def end_turn(game_state, user):
    #Check to make sure all pieces have moved
    if game_state.state != "PLAYING":
        raise IllegalMoveError
    if is_current_turn(game_state, user):
        current_scores = game_state.objectives.split(",")
        for player in game_state.player_set.all():
            print("Player {} score: {}".format(player.number, player.score + current_scores.count(str(player.number))))
            if player.score + current_scores.count(str(player.number)) >= game_state.map.score_to_win:
                end_game(game_state, player)
        game_state.turn_count = game_state.turn_count + 1
        game_state.save()
        for piece in game_state.piece_set.all():
            piece.speed = piece.character.speed
            piece.attack = piece.character.attack
            piece.save()
    else:
        raise IllegalMoveError
    game_state.refresh_from_db()
    return game_state