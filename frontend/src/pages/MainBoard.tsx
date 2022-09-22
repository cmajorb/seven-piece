import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainGrid from '../components/MainGrid';
import { GameState, WebSocketStatus } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Divider, Stack, useTheme } from '@mui/material';
import DisplayGameStatus from '../components/DisplayGameStatus';
import CommandBar from '../components/CommandBar';
import BannerScore from '../components/BannerScore';
import getDisplayTurn from '../utils/getDisplayTurn';

// ----------------------------------------------------------------------

export default function MainBoard() {

  const theme = useTheme();
  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<number>();
  const [activePlayer, setActivePlayer] = useState<number>();
  const [activeTurn, setActiveTurn] = useState<boolean>(false);
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
              const session: string = message.this_player_session;
              if (thisPlayer === undefined) {
                if (session === game_state.players[0].session) { setThisPlayer(game_state.players[0].number) }
                else if (session === game_state.players[1].session) { setThisPlayer(game_state.players[1].number) }
                else { console.log("DID NOT SET PLAYER") };
              };
              console.log('Set GameState:', game_state);
              setGameState(game_state);
              break;
            case 'error':
              console.log(message.message);
              break;
            default:
              console.error('Unknown message type!');
              break;
        }
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [lastJsonMessage]);

useEffect(() => {
  if ((thisPlayer !== undefined) && gameState && gameState.players[0].is_turn) {
    setActivePlayer(0);
  } else { setActivePlayer(1) };
  if ((thisPlayer !== undefined) && gameState && gameState.players[thisPlayer].is_turn) { setActiveTurn(true) };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState]);

const setPieces = (piece_array: string) => {
  sendJsonMessage({
    type: "select_pieces",
    pieces: piece_array
  })
};

const endTurn = () => {
  setActiveTurn(false);
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

  return (
    <>
      <Stack spacing={1}>
        { gameState && (thisPlayer !== undefined) &&
        <Stack spacing={2}>
          <Stack direction={'row'} justifyContent={'space-around'}>
            <DisplayGameStatus
              connection_status={connectionStatus as WebSocketStatus}
              current_state={(gameState ? gameState.state : "None")}
            />
            { getDisplayTurn(gameState.state, gameState.turn_count) >= 0 &&
            <>
              <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
              <BannerScore
                team_scores={getTeamScores(gameState.players)}
                total_objectives={(gameState.objectives).length}
                score_to_win={gameState.score_to_win}
                is_turn={activeTurn}
              />
            </>
            }
            <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
            <CommandBar
              round={gameState.turn_count}
              current_state={gameState.state}
              this_player_id={thisPlayer}
              display_turn={getDisplayTurn(gameState.state, gameState.turn_count)}
              endTurn={endTurn}
              setPieces={setPieces}
            />
          </Stack>
          <Divider flexItem color={theme.palette.common.black} />
          <MainGrid
            rows={gameState.map.data.length}
            columns={gameState.map.data[0].length}
            pieces={gameState.pieces}
            map={gameState.map}
            active_player_id={activePlayer}
            objectives={gameState.objectives}
            this_player_id={thisPlayer}
            submitPieceAction={submitPieceAction}
          />
        </Stack> }
      </Stack>
    </>
  );
};