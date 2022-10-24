import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainBoard from '../components/game-board/MainBoard';
import { GameState, GameStatus, Piece, PieceActions, Player, SpecialAbility } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Paper, Stack } from '@mui/material';
import MainBBar from '../components/bottom-bar/MainB-Bar';
import checkSameLocation from '../utils/checkSameLocation';
import ActionSelect from '../components/action-select-bar/ActionSelect';
import { TurnLine } from '../components/misc/DynamicLines';
import SelectPieces from '../components/SelectPieces';
import { BG_COLOR, EDGE_COLOR, MIDDLE_COLOR } from '../utils/defaultColors';
import { calcValidPieceMoves, calcValidPieceAttacks, calcValidPieceSpecial } from '../utils/calcValidPieceActions';
import getPiece from '../utils/getPiece';
import handleGameState from '../utils/handleGameState';
import useWindowDimensions from '../utils/useWindowDimensions';
import GameFinished from '../components/misc/GameFinished';

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

  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const handleInfoToggle = () => { setInfoOpen((prev) => !prev) };

  const { game_id } = useParams();
  const select_team_seconds = 100;
  const { height } = useWindowDimensions();

  const path_str = "game/" + game_id;
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket('ws://' + process.env.REACT_APP_DJANGO_URL + path_str);

  const setPieces = (piece_array: string) => { sendJsonMessage({ type: "select_pieces", pieces: piece_array }) };
  const endTurn = () => { sendJsonMessage({ type: "end_turn" }) };
  const submitPieceAction = (piece_id: number, new_location: number[], action_type: string) => {
    sendJsonMessage({
      type: "action",
      piece: piece_id,
      location_x: new_location[0],
      location_y: new_location[1],
      action_type: action_type
    })
  };

  useEffect(() => {
    console.log("Joining:");
    sendJsonMessage({ type: "join_game", session: game_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      handleGameState(lastJsonMessage, setGameState, setThisPlayer, setAllPieces, setAllSpecials)
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    setCurrentState((gameState ? gameState.state : "None"));
    if (gameState && (gameState.state === 'WAITING' || gameState.state === 'SELECTING') && !allPieces) {
      sendJsonMessage({ type: "get_characters" });
      sendJsonMessage({ type: "get_specials" });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

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
      if (gameState && gameState.state as GameStatus === 'PLACING' && gameState.players[player.number]) { player.ready = gameState.players[player.number].ready };
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
        } else if (actionType === 'freeze') {
          const valid_piece_range: number[][] = calcValidPieceSpecial(current_piece, gameState.pieces, gameState.map, selectedTile, gameState.objectives);
          setSelectedPieceSpecials(valid_piece_range);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTile, actionType, gameState]);
  
  useEffect(() => { setActionType('move') }, [selectedPiece]);

  const updateSelected = (location: number[], piece: Piece | undefined, show_opponent_pieces: boolean, click: string) => {
    const same_location = checkSameLocation(location, selectedTile);
    if (same_location) { setSelectedTile([]); setSelectedPiece(undefined) }
    else {
      if (selectedPiece && click === 'left') { submitPieceAction(selectedPiece.id, location, actionType) };
      setSelectedTile(location);
      if (piece && piece.player === thisPlayer?.number) { setSelectedPiece(piece) }
      else if (piece && piece.player !== thisPlayer?.number && show_opponent_pieces) { console.log("CLICKED ON ANOTHER PIECE") }
      else { setSelectedPiece(undefined) };
    }
    if (click === 'right') {
      if (gameState && getPiece(location, gameState.pieces)) { setSelectedTile(location); setInfoOpen(true) };
      if (same_location) { setInfoOpen(false); setSelectedTile([]); setSelectedPiece(undefined) };
    };
  };

  return (
    <Paper square elevation={0} onContextMenu={(e)=> e.preventDefault()} onMouseDown={(e)=> e.preventDefault()}
      sx={{
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      { connectionStatus === 'Open' && gameState && thisPlayer &&
        <>
          { (gameState.state === 'WAITING' || gameState.state === 'SELECTING') &&
          <>
            <TurnLine
              start_position={height * 0.45}
              is_turn={(gameState.state === 'WAITING' || gameState.state === 'SELECTING')}
              bg_color={BG_COLOR}
              middle_color={MIDDLE_COLOR}
              edge_color={EDGE_COLOR}
              turn_seconds={select_team_seconds}
            />
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
          </> }
          <>
            { (gameState.state === 'PLAYING' || gameState.state === 'PLACING') &&
              <Stack direction='row'>
                <TurnLine
                  start_position={height * 0.45}
                  is_turn={thisPlayer.is_turn}
                  bg_color={BG_COLOR}
                  middle_color={MIDDLE_COLOR}
                  edge_color={EDGE_COLOR}
                  turn_seconds={100}
                />
                <MainBoard
                  grid_size={height * 0.8}
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
                <ActionSelect
                  start_position={height * 0.2}
                  piece={selectedPiece}
                  all_pieces={gameState.pieces}
                  selected_tile={selectedTile}
                  selected_action={actionType}
                  this_player={thisPlayer}
                  color_scheme={gameState.map.color_scheme}
                  all_specials={allSpecials}
                  current_state={gameState.state as GameStatus}
                  infoOpen={infoOpen}
                  setActionType={setActionType}
                  handleInfoToggle={handleInfoToggle}
                />
              <MainBBar
                pieces={gameState.pieces}
                team_scores={getTeamScores(gameState.players)}
                this_player={thisPlayer}
                active_player_id={gameState.turn_count % gameState.players.length}
                color_scheme={gameState.map.color_scheme}
                current_state={gameState.state as GameStatus}
                score_to_win={gameState.score_to_win}
                bar_height={height * 0.15}
                endTurn={endTurn}
              />
            </Stack>
            }
          </>
          <>
            { gameState.state === 'FINISHED' &&
              <GameFinished
                height={height}
                winner={gameState.winner}
                team_scores={getTeamScores(gameState.players)}
                score_to_win={gameState.score_to_win}
              />
            }
          </>
        </> }
    </Paper>
  );
};