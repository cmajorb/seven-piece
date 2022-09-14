import { useState, useEffect } from 'react';
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
  
  const [gameState, setGameState] = useState<GameState>()
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
          console.log("Received state data")
          console.log(data.state)
          setGameState(JSON.parse(data.state))
          break;
        case 'error':
          console.log("Error: " + data.message)
          break;
        default:
          console.error('Unknown message type!');
          break;
      }
    }
  });

  const { sendJsonMessage } = useWebSocket('ws://127.0.0.1/' + path_str)

  useEffect(() => {
    console.log("Joining:");
    sendJsonMessage({ type: "join_game", session: game_id });
  }, []);

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
        <p>Current session: {gameState ? gameState.session : "None"} </p>
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
      { gameState &&
      <MainGrid
        rows={gameState.map.data.length}
        columns={gameState.map.data[0].length}
        pieces={gameState.pieces}
        constants={constants}
        map={gameState.map}
        round={gameState.turn_count}
        team_1_score={gameState.players[0].score}
        team_2_score={gameState.players[1].score}
      /> }
    </div>

  );
};