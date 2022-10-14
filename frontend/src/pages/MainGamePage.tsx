import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainBoard from '../components/game-board/MainBoard';
import { GameState, GameStatus, Piece, PieceActions, Player, SpecialAbility } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Paper, Stack } from '@mui/material';
import BannerScore from '../components/game-board/BannerScore';
import getDisplayTurn from '../utils/getDisplayTurn';
import MainBBar from '../components/bottom-bar/MainB-Bar';
import checkSameLocation from '../utils/checkSameLocation';
import ActionSelect from '../components/action-select-bar/ActionSelect';
import { TurnLine } from '../components/misc/DynamicLines';
import createAllPieces from '../utils/createAllPieces';
import SelectPieces from '../components/SelectPieces';
import { BG_COLOR, EDGE_COLOR, MIDDLE_COLOR } from '../utils/defaultColors';
import { calcValidPieceMoves, calcValidPieceAttacks, calcValidPieceSpecial } from '../utils/calcValidPieceActions';
import getPiece from '../utils/getPiece';

// ----------------------------------------------------------------------

type Props = {
  setConnectionStatus: any,
  setCurrentState: any,
};

// ----------------------------------------------------------------------

export default function MainGamePage ({ setConnectionStatus, setCurrentState }: Props) {

  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<Player>();
  const [allPieces, setAllPieces] = useState<Piece[]>();
  const [allSpecials, setAllSpecials] = useState<SpecialAbility[]>();

  const [selectedTile, setSelectedTile] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [selectedPieceMoves, setSelectedPieceMoves] = useState<number[][]>([]);
  const [selectedPieceAttacks, setSelectedPieceAttacks] = useState<number[][]>([]);
  const [selectedPieceSpecials, setSelectedPieceSpecials] = useState<number[][]>([]);
  const [actionType, setActionType] = useState<PieceActions>('move');

  const { game_id } = useParams();

  const path_str = "game/" + game_id;
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1:8080/' + path_str)

  useEffect(() => {
    console.log("Joining:");
    sendJsonMessage({ type: "join_game", session: game_id });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null) {
        const message_str = JSON.stringify(lastJsonMessage);
        const message = JSON.parse(message_str);
        switch (message.type) {
            case 'game_state':
              const game_state: GameState = JSON.parse(message.state);
              console.log('Set GameState:', game_state);
              setGameState(game_state);
              break;
            case 'error':
              console.log('error', message.message);
              break;
            case 'connect':
              setThisPlayer(message.player);
              console.log('Setting This Player', message.player);
              break;
            case 'get_characters':
              setAllPieces(createAllPieces(message.characters));
              console.log('Setting All Characters', message.characters);
              break;
            case 'get_specials':
              setAllSpecials(message.specials);
              console.log("Specials", message.specials);
              break;
            default:
              console.error('Unknown message type!');
              console.log(message);
              break;
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  useEffect(() => {
    setCurrentState((gameState ? gameState.state : "None"));
    if (gameState && (gameState.state === 'WAITING' || gameState.state === 'SELECTING') && !allPieces) {
      sendJsonMessage({ type: "get_characters" });
      sendJsonMessage({ type: "get_specials" });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const setPieces = (piece_array: string) => {
    sendJsonMessage({
      type: "select_pieces",
      pieces: piece_array
    })
  };

  const endTurn = () => {
    sendJsonMessage({
      type: "end_turn",
    })
  };

  const submitPieceAction = (piece_id: number, new_location: number[], action_type: string) => {
    sendJsonMessage({
      type: "action",
      piece: piece_id,
      location_x: new_location[0],
      location_y: new_location[1],
      action_type: action_type
    })
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setConnectionStatus(connectionStatus) }, [connectionStatus]);
  useEffect(() => {
    setSelectedTile([]);
    setSelectedPiece(undefined);
    if (gameState && thisPlayer) {
      const player: Player = thisPlayer;
      if (gameState && gameState.state as GameStatus === 'PLACING') { player.ready = gameState.players[player.number].ready };
      if ((gameState.turn_count % gameState.players.length) === player.number) { player.is_turn = true }
      else if ((gameState.turn_count % gameState.players.length) !== player.number) { player.is_turn = false };
      setThisPlayer(player);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  useEffect(() => {
    if (gameState) {
      const current_piece: Piece | undefined = getPiece(selectedTile, gameState.pieces);
      setSelectedPieceMoves([]);
      setSelectedPieceAttacks([]);
      setSelectedPieceSpecials([]);
      if (current_piece) {
        if (actionType === 'move') {
          const valid_piece_range: number[][] = calcValidPieceMoves(current_piece, gameState.map, selectedTile, gameState.objectives);
          setSelectedPieceMoves(valid_piece_range);
        } else if (actionType === 'attack') {
          const valid_piece_range: number[][] = calcValidPieceAttacks(current_piece, gameState.pieces, gameState.map, selectedTile, gameState.objectives);
          setSelectedPieceAttacks(valid_piece_range);
          console.log(valid_piece_range);
        } else if (actionType === 'freeze') {
          const valid_piece_range: number[][] = calcValidPieceSpecial(current_piece, gameState.pieces, gameState.map, selectedTile, gameState.objectives);
          setSelectedPieceSpecials(valid_piece_range);
          console.log(valid_piece_range);          
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTile, actionType, gameState]);
  
  useEffect(() => { setActionType('move') }, [selectedPiece]);

  const updateSelected = (location: number[], piece: Piece | undefined, checking: boolean, show_opponent_pieces: boolean) => {
    const same_location = checkSameLocation(location, selectedTile);
    if (same_location) { setSelectedTile([]); setSelectedPiece(undefined) }
    else {
      if (selectedPiece && !checking) { submitPieceAction(selectedPiece.id, location, actionType) };
      setSelectedTile(location);
      if (piece && piece.player === thisPlayer?.number) { setSelectedPiece(piece) }
      else if (piece && piece.player !== thisPlayer?.number && show_opponent_pieces) { console.log("CLICKED ON ANOTHER PIECE") }
      else { setSelectedPiece(undefined) };
    }
  };

  return (
    <Paper square elevation={0} onContextMenu={(e)=> e.preventDefault()} onMouseDown={(e)=> e.preventDefault()}
      sx={{
        p: 1,
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '120vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {
        (connectionStatus === 'Open' &&
        gameState &&
        thisPlayer &&
        (gameState.state === 'WAITING' || gameState.state === 'SELECTING')) ?
      <>
        { allPieces &&
        <SelectPieces
          all_pieces={allPieces}
          all_selected_pieces={gameState.pieces}
          num_allowed_pieces={gameState.allowed_pieces}
          game_state={gameState.state}
          map={gameState.map}
          this_player_id={thisPlayer.number}
          setPieces={setPieces}
          endTurn={endTurn}
        /> }
      </> :
      <>
        { gameState && (thisPlayer !== undefined) &&
          <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
            <Stack spacing={0} justifyContent={'center'} alignItems={'center'}>
              { getDisplayTurn(gameState.state as GameStatus, gameState.turn_count) >= 0 &&
                <BannerScore
                  team_scores={getTeamScores(gameState.players)}
                  total_objectives={(gameState.objectives).length}
                  score_to_win={gameState.score_to_win}
                />
              }
              <Stack direction='row-reverse'>
                <ActionSelect
                  piece={selectedPiece}
                  all_pieces={gameState.pieces}
                  selected_tile={selectedTile}
                  selected_action={actionType}
                  this_player={thisPlayer}
                  color_scheme={gameState.map.color_scheme}
                  all_specials={allSpecials}
                  current_state={gameState.state as GameStatus}
                  setActionType={setActionType}
                />
                <MainBoard
                  pieces={gameState.pieces}
                  map={gameState.map}
                  objectives={gameState.objectives}
                  this_player_id={thisPlayer.number}
                  selected_tile={selectedTile}
                  selected_piece_actions={
                    actionType === 'move' ? selectedPieceMoves : 
                    (actionType === 'attack' ? selectedPieceAttacks :
                    (actionType.length > 0 ? selectedPieceSpecials : undefined))
                  }
                  current_state={gameState.state as GameStatus}
                  updateSelected={updateSelected}
                />
                <TurnLine
                  is_turn={thisPlayer.is_turn}
                  bg_color={BG_COLOR}
                  middle_color={MIDDLE_COLOR}
                  edge_color={EDGE_COLOR}
                  turn_seconds={100}
                />
              </Stack>
            </Stack>
            { gameState && (thisPlayer !== undefined) &&
              <MainBBar
                pieces={gameState.pieces}
                selected_piece={selectedPiece}
                selected_tile={selectedTile}
                this_player={thisPlayer}
                active_player_id={gameState.turn_count % gameState.players.length}
                color_scheme={gameState.map.color_scheme}
                current_state={gameState.state as GameStatus}
                score_to_win={gameState.score_to_win}
                updateSelected={updateSelected}
                endTurn={endTurn}
                setPieces={setPieces}
              />
            }
          </Stack>
        }
      </> }
    </Paper>
  );
};