import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainGrid from '../components/MainGrid';
import { GameState, WebSocketStatus, Player } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Divider, Stack, useTheme } from '@mui/material';
import CommandBar from '../components/CommandBar';
import BannerScore from '../components/BannerScore';
import getDisplayTurn from '../utils/getDisplayTurn';

// ----------------------------------------------------------------------

type Props = {
  setConnectionStatus: any,
  setCurrentState: any,
};

// ----------------------------------------------------------------------

export default function MainBoard ({ setConnectionStatus, setCurrentState }: Props) {

  const theme = useTheme();
  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<Player>();
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
              console.log(message.message);
              break;
            case 'connect':
              setThisPlayer(message.player);
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

  return (
    <>
      <Stack spacing={1}>
        { gameState && (thisPlayer !== undefined) &&
        <Stack spacing={2}>
          <Stack direction={'row'} justifyContent={'space-around'}>
            { getDisplayTurn(gameState.state, gameState.turn_count) >= 0 &&
            <>
              <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
              <BannerScore
                team_scores={getTeamScores(gameState.players)}
                total_objectives={(gameState.objectives).length}
                score_to_win={gameState.score_to_win}
                is_turn={thisPlayer.is_turn}
              />
            </>
            }
            <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
            <CommandBar
              round={gameState.turn_count}
              current_state={gameState.state}
              this_player_id={thisPlayer.number}
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
            active_player_id={gameState.turn_count % gameState.players.length}
            objectives={gameState.objectives}
            this_player_id={thisPlayer.number}
            game_state={gameState.state}
            submitPieceAction={submitPieceAction}
          />
        </Stack> }
      </Stack>
    </>
  );
};