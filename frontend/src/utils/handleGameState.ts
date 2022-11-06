import { JsonValue } from "react-use-websocket/dist/lib/types";
import { GameState } from "../types";
import createAllPieces from "./pieces/createAllPieces";
  
// ----------------------------------------------------------------------

export default function handleGameState
    (lastJsonMessage: JsonValue | null, setGameState: any, setThisPlayer: any, setAllPieces: any, setAllSpecials: any, setRemainingTime: any) {
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
        case 'get_specials':
          setAllSpecials(message.specials);
          console.log("Specials", message.specials);
          break;
        case 'timer':
          console.log("Check Timer", message.time);
          setRemainingTime(message.time);
          break;
        default:
          console.error('Unknown message type!');
          console.log(message);
          break;
    }
}