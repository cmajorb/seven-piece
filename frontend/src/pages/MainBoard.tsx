import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useLocation, useParams } from 'react-router-dom';
import MainGrid from '../components/MainGrid';
import { Constants, GameState } from '../types';

export default function MainBoard() {
  const sample_game_state: GameState = require('../testing/game_state.json');
  const constants: Constants = require('../testing/constants.json');
  const num_rows = (sample_game_state.map.data).length;
  const num_columns = (sample_game_state.map.data[0]).length;

  const { pathname } = useLocation();
  console.log("PATHNAME", pathname.split("/")[1]);

  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const { game_id } = useParams();
  
  const path_str = "game/" + game_id;
  const { readyState } = useWebSocket('ws://127.0.0.1/' + path_str, {
    onOpen: () => {
      console.log("Connected!")
    },
    onClose: () => {
      console.log("Disconnected!")
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'game_state':
          console.log(data.state)
          break;
        case 'error':
          console.log(data.message)
          break;
        default:
          console.error('Unknown message type!');
          break;
      }
    }
  });

  const { sendJsonMessage } = useWebSocket('ws://127.0.0.1/' + path_str)

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
        <span>The WebSocket is currently: {connectionStatus}</span>
        <p>{welcomeMessage}</p>
      </div>
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        sendJsonMessage({
          type: "move",
          selected_piece: 0,
          target_x: 2,
          target_y: 3,
          action: "move",
          })
      }}
    >
    Make a move (2,3)
    </button>
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        sendJsonMessage({
          type: "join_game",
          session: game_id,
        })
      }}
    >
      Join game
    </button>
    <button className='bg-gray-300 px-3 py-1' 
      onClick={() => {
        sendJsonMessage({
          type: "create_game",
          map: "1",
        })
      }}
    >
      Create game
    </button>
  <hr />
  <ul>
    {messageHistory.map((message: any, idx: number) => (
      <div className='border border-gray-200 py-3 px-3' key={idx}>
        {message.name}: {message.message}
      </div>
    ))}
  </ul>
      { sample_game_state &&
      <MainGrid
        rows={num_rows}
        columns={num_columns}
        pieces={sample_game_state.pieces}
        constants={constants}
        map={sample_game_state.map}
        round={sample_game_state.turn_count}
        team_1_score={3}
        team_2_score={4}
      /> }
    </div>

  );
};