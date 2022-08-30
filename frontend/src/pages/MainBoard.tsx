import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useLocation } from 'react-router-dom';

export default function MainBoard() {
  const { pathname } = useLocation();
  console.log("PATHNAME", pathname.split("/")[1]);
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const { readyState } = useWebSocket('ws://127.0.0.1/' + pathname.split("/")[1], {
    onOpen: () => {
      console.log("Connected!")
    },
    onClose: () => {
      console.log("Disconnected!")
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'welcome_message':
          setWelcomeMessage(data.message)
          break;
        case 'chat_message_echo':
          setMessageHistory((prev:any) => prev.concat(data));
          break;
        case 'game_state':
          console.log(data.state)
          break;
        default:
          console.error('Unknown message type!');
          break;
      }
    }
  });

  const { sendJsonMessage } = useWebSocket('ws://127.0.0.1/' + pathname.split("/")[1])

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
      <span>The WebSocket is currently {connectionStatus}</span>
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
      type: "join_room",
      name: "room1",
    })
  }}
>
  Join room
</button>
<hr />
<ul>
  {messageHistory.map((message: any, idx: number) => (
    <div className='border border-gray-200 py-3 px-3' key={idx}>
      {message.name}: {message.message}
    </div>
  ))}
</ul>
    </div>
  );
};