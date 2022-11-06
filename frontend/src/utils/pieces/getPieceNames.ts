import { Piece } from "../../types";

// ----------------------------------------------------------------------

export default function getPieceNames (pieces: Piece[]) {
    let piece_names: string[] = [];
    for (let index in pieces) {
        const piece = pieces[index];
        piece_names.push(piece.name);
    }
    return piece_names;
};