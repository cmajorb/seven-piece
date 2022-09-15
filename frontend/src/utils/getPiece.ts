import { Piece } from "../types";

// ----------------------------------------------------------------------

export default function getPiece (curr_location: number[], pieces: Piece[]) {
    console.log("Getting piece");
    for (let index in pieces) {
        const piece = pieces[index];
        if (curr_location[0] === piece.location[0] && curr_location[1] === piece.location[1]) { return piece };
    }
    console.log("No piece found at " + curr_location);
    return undefined;
}