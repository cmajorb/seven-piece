import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainGrid from '../components/MainGrid';
import { GameState } from '../types';
import getTeamScores from '../utils/getTeamScores';
import BottomBar from '../components/BottomBar';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function MainBoard() {

  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<number>();
  const [activeTurn, setActiveTurn] = useState<boolean>(false);
  const { game_id } = useParams();

  const path_str = "game/" + game_id;
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1/' + path_str)

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
  if ((thisPlayer !== undefined) && gameState && gameState.players[thisPlayer].is_turn) { setActiveTurn(true) };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState]);

const endTurn = () => {
  setActiveTurn(false);
  sendJsonMessage({
    type: "end_turn",
  })
}

const submitPieceMove = (piece_id: number, new_location: number[]) => {
  sendJsonMessage({
    type: "action",
    piece: piece_id,
    location_x: new_location[0],
    location_y: new_location[1],
    action_type: "move"
  })
}

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <div>
        <p>The WebSocket is currently: {connectionStatus}</p>
        <p>Game State: {gameState ? gameState.state : "None"} </p>
      </div>
  
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        let piece_array = JSON.stringify(["Soldier", "Berserker"])
        sendJsonMessage({
          type: "select_pieces",
          pieces: piece_array
        })
      }}
    >
      Select Pieces
    </button>
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        sendJsonMessage({
          type: "action",
          piece: gameState ? gameState.pieces[2].id : "",
          location_x: 0,
          location_y: 0,
          action_type: "move"
        })
        sendJsonMessage({
          type: "action",
          piece: gameState ? gameState.pieces[3].id : "",
          location_x: 0,
          location_y: 1,
          action_type: "move"
        })
      }}
    >
      Place Pieces1
    </button>
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        sendJsonMessage({
          type: "action",
          piece: gameState ? gameState.pieces[0].id : "",
          location_x: 10,
          location_y: 10,
          action_type: "move"
        })
        sendJsonMessage({
          type: "action",
          piece: gameState ? gameState.pieces[1].id : "",
          location_x: 9,
          location_y: 10,
          action_type: "move"
        })
      }}
    >
      Place Pieces2
    </button>
  <hr />
      { gameState && (thisPlayer !== undefined) &&
      <Stack spacing={2}>
        <MainGrid
          rows={gameState.map.data.length}
          columns={gameState.map.data[0].length}
          pieces={gameState.pieces}
          map={gameState.map}
          active_turn={activeTurn}
          objectives={gameState.objectives}
          submitPieceMove={submitPieceMove}
        />
        <BottomBar
          round={gameState.state !== ('PLACING' || 'READY') ? (gameState.turn_count + 1) : -1}
          team_scores={getTeamScores(gameState.players)}
          this_player_id={thisPlayer}
          endTurn={endTurn}
        />
      </Stack> }
    </div>

  );
};