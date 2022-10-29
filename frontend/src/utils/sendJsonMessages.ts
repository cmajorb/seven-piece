import { useParams } from 'react-router-dom';
import { GameState, Piece } from '../types';

// ----------------------------------------------------------------------

export function PathStr () {
    const { game_id } = useParams();
    const path_str = "game/" + game_id;
    return path_str;
};

export function endTurn (sendJsonMessage: any) { sendJsonMessage({ type: "end_turn" }) };

export function submitPieceAction (piece_id: number, new_location: number[], action_type: string, sendJsonMessage: any) {
    sendJsonMessage({
        type: "action",
        piece: piece_id,
        location_x: new_location[0],
        location_y: new_location[1],
        action_type: action_type
    })
  };

export function getStartingInfo (gameState: GameState | undefined, all_pieces: Piece[] | undefined, sendJsonMessage: any) {
    if (gameState && (gameState.state === 'WAITING' || gameState.state === 'SELECTING') && !all_pieces) {
        sendJsonMessage({ type: "get_characters" });
        sendJsonMessage({ type: "get_specials" });
      };
};

export function joinGame (game_id: string | undefined, sendJsonMessage: any) {
    sendJsonMessage({ type: "join_game", session: game_id });
};