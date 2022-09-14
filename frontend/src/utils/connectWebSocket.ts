import useWebSocket, { ReadyState } from 'react-use-websocket';

// ----------------------------------------------------------------------

export function ConnectWebSocket (path_str: string) {
    const { readyState } = useWebSocket('ws://127.0.0.1/' + path_str, {
        onOpen: () => {
          console.log("Connected!")
        },
        onClose: () => {
          console.log("Disconnected!")
        },
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case 'game_state':
                console.log("Received state data");
                break;
                case 'error':
                console.log(data.message);
                break;
                default:
                console.error('Unknown message type!');
                break;
            }
            }
        });

    const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    
    return connectionStatus;
  }