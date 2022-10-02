import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainGrid from '../components/game-board/MainBoard';
import { GameState, Piece, PieceActions, Player } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Paper, Stack } from '@mui/material';
import BannerScore from '../components/game-board/BannerScore';
import getDisplayTurn from '../utils/getDisplayTurn';
import MainBBar from '../components/bottom-bar/MainB-Bar';
import checkSameLocation from '../utils/checkSameLocation';
import ActionSelect from '../components/ActionSelect';
import PieceDetails from '../components/PieceDetails';
import { TurnLine } from '../components/misc/DynamicLines';
import getPiece from '../utils/getPiece';
import createAllPieces from '../utils/createAllPieces';
import SelectPieces from '../components/SelectPieces';
import { BG_COLOR, EDGE_COLOR, MIDDLE_COLOR } from '../utils/defaultColors';

// ----------------------------------------------------------------------

type Props = {
  setConnectionStatus: any,
  setCurrentState: any,
};

// ----------------------------------------------------------------------

export default function MainBoard ({ setConnectionStatus, setCurrentState }: Props) {

  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<Player>();
  const [selectedTile, setSelectedTile] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [allPieces, setAllPieces] = useState<Piece[]>();
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
    if (gameState && (gameState.state === 'WAITING' || gameState.state === 'PLACING') && !allPieces) {
      console.log("CALLING SET PIECES");
      sendJsonMessage({ type: "get_characters" });
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
      if ((gameState.turn_count % gameState.players.length) === player.number) { player.is_turn = true }
      else if ((gameState.turn_count % gameState.players.length) !== player.number) { player.is_turn = false };
      setThisPlayer(player);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  useEffect(() => {}, [selectedTile]);
  useEffect(() => { setActionType('move') }, [selectedPiece]);

  const updateSelected = (location: number[], piece: Piece | undefined, checking: boolean) => {
    const same_location = checkSameLocation(location, selectedTile);
    if (same_location) { setSelectedTile([]); setSelectedPiece(undefined) }
    else {
        if (selectedPiece && !checking) { submitPieceAction(selectedPiece.id, location, actionType) };
        setSelectedTile(location);
        if (piece && piece.player === thisPlayer?.number) { setSelectedPiece(piece) }
        else if (piece && piece.player !== thisPlayer?.number) { console.log("CLICKED ON ANOTHER PIECE") }
        else { setSelectedPiece(undefined) };
    }
  }

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
        (gameState.state === 'WAITING' || gameState.state === 'PLACING')) ?
      <>
        { allPieces &&
        <SelectPieces
          all_pieces={allPieces}
          all_selected_pieces={gameState.pieces}
          num_allowed_pieces={2}
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
            <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
              { getDisplayTurn(gameState.state, gameState.turn_count) >= 0 &&
                <BannerScore
                  team_scores={getTeamScores(gameState.players)}
                  total_objectives={(gameState.objectives).length}
                  score_to_win={gameState.score_to_win}
                />
              }
              <Stack direction='row-reverse'>
                <PieceDetails observed_piece={getPiece(selectedTile, gameState.pieces)} />
                <ActionSelect
                  piece={selectedPiece}
                  selected_tile={selectedTile}
                  selected_action={actionType}
                  this_player_id={thisPlayer.number}
                  color_scheme={gameState.map.color_scheme}
                  updateSelected={updateSelected}
                  setActionType={setActionType}
                />
                <MainGrid
                  pieces={gameState.pieces}
                  map={gameState.map}
                  objectives={gameState.objectives}
                  this_player_id={thisPlayer.number}
                  selected_tile={selectedTile}
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
                this_player_id={thisPlayer.number}
                active_player_id={gameState.turn_count % gameState.players.length}
                color_scheme={gameState.map.color_scheme}
                current_state={gameState.state}
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