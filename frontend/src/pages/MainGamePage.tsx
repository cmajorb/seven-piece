import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MainBoard from '../components/game-board/MainBoard';
import { AnimationDirection, AnimationType, GameState, GameStatus, Piece, PieceActions, Player, SpecialAbility } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Paper, Stack } from '@mui/material';
import MainBBar from '../components/bottom-bar/MainB-Bar';
import checkSameLocation from '../utils/checkSameLocation';
import ActionSelect from '../components/action-select-bar/ActionSelect';
import { TurnLine } from '../components/misc/DynamicLines';
import SelectPieces from '../components/SelectPieces';
import { BG_COLOR, EDGE_COLOR, MIDDLE_COLOR } from '../utils/defaultColors';
import getPiece from '../utils/pieces/getPiece';
import handleGameState from '../utils/handleGameState';
import useWindowDimensions from '../utils/useWindowDimensions';
import GameFinished from '../components/misc/GameFinished';
import { getStartingInfo, getTime, joinGame, PathStr, submitPieceAction } from '../utils/sendJsonMessages';
import { useParams } from 'react-router-dom';
import handleSelectedPiece from '../utils/pieces/handleSelectedPiece';
import { getActionLocations } from '../utils/pieces/calcValidPieceActions';
import calcAttackDirection from '../utils/pieces/calcAttackDirection';
import WaitingScreen from '../components/misc/WaitingScreen';
import delay from '../utils/delay';

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

  const [remainingTime, setRemainingTime] = useState<number>(0);

  const [selectedTile, setSelectedTile] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [selectedPieceMoves, setSelectedPieceMoves] = useState<number[][]>([]);
  const [selectedPieceAttacks, setSelectedPieceAttacks] = useState<number[][]>([]);
  const [selectedPieceSpecials, setSelectedPieceSpecials] = useState<number[][]>([]);
  const [actionType, setActionType] = useState<PieceActions>('move');

  const [animationInitiator, setAnimationInitiator] = useState<Piece | undefined>();
  const [animationRecipient, setAnimationRecipient] = useState<Piece | undefined>();
  const [animationType, setAnimationType] = useState<AnimationType>('move');
  const [animationDirection, setAnimationDirection] = useState<AnimationDirection>('center');


  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const handleInfoToggle = () => { setInfoOpen((prev) => !prev) };

  const select_team_seconds = 100;
  const { height } = useWindowDimensions();

  const { game_id } = useParams();
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket('ws://' + process.env.REACT_APP_DJANGO_URL + PathStr(), {share: true});

  const setPieces = (piece_array: string) => { sendJsonMessage({ type: "select_pieces", pieces: piece_array }) };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { joinGame(game_id, sendJsonMessage) }, []);
  useEffect(() => { if (lastJsonMessage !== null) { handleGameState(lastJsonMessage, setGameState, setThisPlayer, setAllPieces, setAllSpecials, setRemainingTime) } }, [lastJsonMessage]);
  useEffect(() => {
    setCurrentState((gameState ? gameState.state : "None"));
    getStartingInfo(gameState, allPieces, sendJsonMessage);
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
  useEffect(() => { setActionType('move') }, [selectedPiece]);

  useEffect(() => {
    if (gameState) {
      handleSelectedPiece(gameState, actionType, selectedTile, setSelectedPieceMoves, setSelectedPieceAttacks, setSelectedPieceSpecials);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTile, actionType, gameState]);

  useEffect(() => {
    if (thisPlayer && thisPlayer.is_turn) {
      delay(1000).then(() => { getTime(sendJsonMessage) } );
    } else if (thisPlayer && !thisPlayer.is_turn) {
      setRemainingTime(0);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime, thisPlayer]);

  const handleTurnChange = () => {
    setSelectedTile([]);
    setSelectedPiece(undefined);
    if (gameState && thisPlayer) {
      if (gameState && gameState.state as GameStatus === 'PLACING' && gameState.players[thisPlayer.number]) { thisPlayer.ready = gameState.players[thisPlayer.number].ready };
      if ((gameState.turn_count % gameState.players.length) === thisPlayer.number) { thisPlayer.is_turn = true }
      else if ((gameState.turn_count % gameState.players.length) !== thisPlayer.number) { thisPlayer.is_turn = false };
      setThisPlayer(thisPlayer);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleTurnChange() }, [gameState]);

  const updateSelected = (location: number[], piece: Piece | undefined, show_opponent_pieces: boolean, click: string) => {
    const same_location = checkSameLocation(location, selectedTile);
    if (same_location) { setSelectedTile([]); setSelectedPiece(undefined); setAnimationInitiator(undefined) }
    else {
      if (selectedPiece && click === 'left') {
        setAnimationInitiator(selectedPiece);
        setAnimationRecipient(piece);
        if (piece && (actionType === 'melee attack' || actionType === 'range attack')) {
          setAnimationDirection(calcAttackDirection(selectedPiece, piece));
          if (actionType === 'range attack') { setAnimationType('range attack') }
          else { setAnimationType('melee attack') };
        } else if (piece && actionType === 'freeze') { setAnimationType('range attack') };

        submitPieceAction(selectedPiece.id, location, actionType, sendJsonMessage);
      };
      setSelectedTile(location);
      if (piece && piece.player === thisPlayer?.number) { setSelectedPiece(piece); setAnimationDirection('center'); setAnimationType('move') }
      else if (piece && piece.player !== thisPlayer?.number && show_opponent_pieces) { console.log("CLICKED ON ANOTHER PIECE") }
      else { setSelectedPiece(undefined); setAnimationDirection('center'); setAnimationType('move') };
    }
    if (click === 'right') {
      if (gameState && getPiece(location, gameState.pieces)) { setSelectedTile(location); setInfoOpen(true) };
      if (same_location) { setInfoOpen(false); setSelectedTile([]); setSelectedPiece(undefined) };
    };
  };

  return (
    <Paper square elevation={0} onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()}
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
          { gameState.state === 'WAITING' &&
            <WaitingScreen
              wait_time={120}
              bg_color={BG_COLOR}
              middle_color={MIDDLE_COLOR}
              edge_color={EDGE_COLOR}
            />
          }
          { gameState.state === 'SELECTING' &&
          <>
            <TurnLine
              start_position={height * 0.45}
              is_turn={true}
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
              map={gameState.map}
              this_player_id={thisPlayer.number}
              setPieces={setPieces}
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
                  turn_seconds={remainingTime}
                />
                <MainBoard
                  grid_size={height * 0.8}
                  pieces={gameState.pieces}
                  map={gameState.map}
                  objectives={gameState.objectives}
                  this_player_id={thisPlayer.number}
                  selected_tile={selectedTile}
                  selected_piece_actions={getActionLocations(actionType, selectedPieceMoves, selectedPieceAttacks, selectedPieceSpecials)}
                  current_state={gameState.state as GameStatus}
                  updateSelected={updateSelected}

                  is_turn={thisPlayer.is_turn}
                  animation_initiator={animationInitiator}
                  animation_recipient={animationRecipient}
                  animation_type={animationType}
                  animation_direction={animationDirection}
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