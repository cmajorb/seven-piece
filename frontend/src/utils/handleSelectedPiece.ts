import { GameState, Piece, PieceActions } from "../types";
import { calcValidPieceAttacks, calcValidPieceMoves, calcValidPieceSpecial } from "./calcValidPieceActions";
import getPiece from "./getPiece";

// ----------------------------------------------------------------------

export default function handleSelectedPiece (gameState: GameState, action_type: PieceActions, selected_tile: number[], setSelectedPieceMoves: any, setSelectedPieceAttacks: any, setSelectedPieceSpecials: any) {
    const current_piece: Piece | undefined = getPiece(selected_tile, gameState.pieces);
    setSelectedPieceMoves([]);
    setSelectedPieceAttacks([]);
    setSelectedPieceSpecials([]);
    if (current_piece) {
        if (action_type === 'move') {
            const valid_piece_range: number[][] = calcValidPieceMoves(current_piece, gameState.map, selected_tile, gameState.objectives);
            setSelectedPieceMoves(valid_piece_range);
        } else if (action_type === 'attack') {
            const valid_piece_range: number[][] = calcValidPieceAttacks(current_piece, gameState.pieces, gameState.map, selected_tile, gameState.objectives);
            setSelectedPieceAttacks(valid_piece_range);
        } else if (action_type === 'freeze') {
            const valid_piece_range: number[][] = calcValidPieceSpecial(current_piece, gameState.pieces, gameState.map, selected_tile, gameState.objectives);
            setSelectedPieceSpecials(valid_piece_range);
        }
    }
};