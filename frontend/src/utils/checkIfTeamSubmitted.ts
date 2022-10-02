import { Piece } from "../types";

// ----------------------------------------------------------------------

export default function checkIfTeamSubmitted (pieces: Piece[], player_id: number) {
    for (let index in pieces) {
        const piece = pieces[index];
        if (piece.player === player_id) { return true };
    }
    return false;
}