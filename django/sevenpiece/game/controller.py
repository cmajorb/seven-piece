from re import A
from game.models import Piece, GameState, Map, Player, Character
from game.data.constants import MAP_DEFINITION
from game.exceptions import IllegalMoveError, GameDoesNotExist, IllegalPieceSelection, JoinGameError

def create_game(user, map_id):
    map = Map.objects.get(id=map_id)
    game_state = GameState.objects.create(map=map)
    Player.objects.create(user=user, game=game_state, number=0)
    return game_state

def join_game(user, session):
    try:
        game_state = GameState.objects.get(session=session)
    except:
        raise GameDoesNotExist
    num_of_players = len(game_state.player_set.all())
    if num_of_players >= game_state.map.player_size:
        raise JoinGameError
    Player.objects.create(user=user, game=game_state, number=num_of_players)
    if num_of_players + 1 == game_state.map.player_size:
        game_state.state = "READY"
        game_state.save()
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

def init_game(game_state):
    game_state.state = "PLACING"
    for piece in game_state.piece_set.all():
        piece.health = piece.character.health
        piece.range = piece.character.speed
        piece.attack = piece.character.attack
        piece.save()
    game_state.save()

def is_range_valid(piece, location, board, range):
    map_length_x = len(board)
    map_length_y = len(board[0])
    x_diff = abs(piece.location_x - location[0])
    y_diff = abs(piece.location_y - location[1])
    if location[0] < map_length_x and location[1] < map_length_y and location[0] >= 0 and location[1] >= 0: 
        if piece.location_x == location[0] and y_diff <= range:
            return True
        elif piece.location_y == location[1] and x_diff <= range:
            return True
        elif x_diff == y_diff and x_diff <= range:
            return True
    return False

def make_move(piece_id, location, session, user):
    game_state = GameState.objects.get(session=session)
    board = game_state.map.data["data"]
    piece = Piece.objects.get(id=piece_id)
    player = Player.objects.get(user=user, game=game_state)
    if game_state.state == "PLACING":
        place_piece(piece, location, game_state, player.number)
        game_state.refresh_from_db()
        return game_state
    if not is_current_turn(game_state, user):
        print("Not your turn")
        raise IllegalMoveError
    if not is_range_valid(piece, location, board, piece.range):
        print("Out of range")
        raise IllegalMoveError
    if board[location[0]][location[1]] not in [MAP_DEFINITION['normal'],MAP_DEFINITION['objective']]:
        print("Not a valid tile")
        raise IllegalMoveError
    move_piece(piece, location, game_state)
    game_state.refresh_from_db()
    return game_state

def move_piece(piece, location, game_state):
    previous_x = piece.location_x
    previous_y = piece.location_y

    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.range = 0
    piece.save()

    board = game_state.map.data["data"]
    board[previous_x][previous_y] &=  ~MAP_DEFINITION['player']
    board[location[0]][location[1]] |=  MAP_DEFINITION['player']
    game_state.map.data["board"] = board
    game_state.map.save()

def place_piece(piece, location, game_state, player_num):
    valid_tiles = game_state.map.data["start_tiles"][player_num]
    if location in valid_tiles:
        move_placed_piece(piece, location, game_state)
    else:
        raise IllegalMoveError

    #Check to see if all pieces are placed
    if len(game_state.piece_set.all().filter(location_x__isnull=False)) == game_state.map.num_characters * game_state.map.player_size:
        start_game(game_state)

def start_game(game_state):
    game_state.state = "PLAYING"
    game_state.save()
    print("Game started")

def move_placed_piece(piece, location, game_state):
    piece.location_x = location[0]
    piece.location_y = location[1]
    piece.save()

    board = game_state.map.data["data"]
    board[location[0]][location[1]] |=  MAP_DEFINITION['player']
    game_state.map.data["board"] = board
    game_state.map.save()

def take_damage(target, damage):
    target.health -= damage
    target.save()
    return target

def end_game(game_state, winner):
    print("The winner is {}".format(winner.user.id))
    game_state.state = "FINISHED"
    #Delete the game_state?

def end_turn(game_state, user):
    #Check to make sure all pieces have moved
    if is_current_turn(game_state, user):
        for player in game_state.player_set.all():
            if player.score >= game_state.map.score_to_win:
                end_game(game_state, player)
        game_state.turn_count = game_state.turn_count + 1
        game_state.save()
        for piece in game_state.piece_set.all():
            piece.range = piece.character.speed
            piece.attack = piece.character.attack
            piece.save()
    else:
        raise IllegalMoveError
    game_state.refresh_from_db()
    return game_state

def is_current_turn(game_state, user):
    print("Turn count: {}".format(game_state.turn_count))
    return game_state.turn_count % game_state.map.player_size == Player.objects.get(game=game_state, user=user).number

def remove_piece(game_state, target_piece, piece):
    target_piece.health = 0
    target_piece.save()
    game_state.map.data["board"][target_piece.location_x][target_piece.location_y] &=  ~MAP_DEFINITION['player']
    piece.player.score += 1
    piece.player.save()

def attack(game_state, location, user, piece_id):
    #check to make sure it isn't on their team
    piece = Piece.objects.get(id=piece_id)
    print("Attack: {}/{}".format(piece.attack, piece.character.attack))
    if not is_current_turn(game_state, user):
        print("Not your turn")
        raise IllegalMoveError
    if piece.attack == 0:
        print("No available attack")
        raise IllegalMoveError
    if not is_range_valid(piece, location, game_state.map.data["data"], piece.character.attack_range):
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
    
def get_piece_by_location(game_state, location):
    return game_state.piece_set.all().filter(location_x=location[0], location_y=location[1]).first()
