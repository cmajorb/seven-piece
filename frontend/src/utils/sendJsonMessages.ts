import { useParams } from 'react-router-dom';
import { GameState, Piece, PieceActions } from '../types';

// ----------------------------------------------------------------------

export function PathStr () {
    const { game_id } = useParams();
    const path_str = "game/" + game_id;
    return path_str;
};

export function endTurn (sendJsonMessage: any) { sendJsonMessage({ type: "end_turn" }) };

export function submitPieceAction (piece_id: number, new_location: number[], action_type: PieceActions, sendJsonMessage: any) {
    const action = (action_type === 'melee attack' || action_type === 'range attack') ? 'attack' : action_type;
    sendJsonMessage({
        type: "action",
        piece: piece_id,
        location_x: new_location[0],
        location_y: new_location[1],
        action_type: action
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

export function getTime (sendJsonMessage: any) {
    sendJsonMessage({ type: "check_timer" });
};