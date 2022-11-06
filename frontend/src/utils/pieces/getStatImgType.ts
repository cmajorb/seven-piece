import { Piece } from "../../types";

// ----------------------------------------------------------------------

export default function getStatImgType (stat: string, piece: Piece) {
    if (stat === 'attack') {
        if (piece.current_stats.attack > 0) {
            if (piece.current_stats.attack_range_max > 1) { return 'range' } else { return 'melee' };
        } else if (piece.current_stats.special > 0) {
            return 'freeze';
        } else { return 'attack' };
    } else { return stat };
};