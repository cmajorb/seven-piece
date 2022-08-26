import React from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function App() {
  const { readyState } = useWebSocket('ws://127.0.0.1/', {
    onOpen: () => {
      console.log("Connected!")
    },
    onClose: () => {
      console.log("Disconnected!")
    }
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
    </div>
  );
};