import { Piece } from '../types';

// ----------------------------------------------------------------------

export default function createAllPieces (all_pieces_info: any[]) {
    let all_pieces: Piece[] = [];
    for (let index in all_pieces_info) {
        const piece_info = all_pieces_info[index];
        const parsed_piece: Piece = {
            id: piece_info.id,
            name: piece_info.name,
            player: -1,
            description: piece_info.description,
            location: [-1, -1],
            image: piece_info.image,
            current_stats: {
                health: piece_info.health,
                attack: piece_info.attack,
                attack_range_max: piece_info.attack_range_max,
                attack_range_min: piece_info.attack_range_min,
                speed: piece_info.speed,
                special: piece_info.special,
                special_range_max: piece_info.special_range_max,
                special_range_min: piece_info.special_range_min,
            },
            start_stats: {
                health: piece_info.health,
                attack: piece_info.attack,
                attack_range_max: piece_info.attack_range_max,
                attack_range_min: piece_info.attack_range_min,
                speed: piece_info.speed,
                special: piece_info.special,
                special_range_max: piece_info.special_range_max,
                special_range_min: piece_info.special_range_min,
            },
            default_stats: {
                health: piece_info.health,
                attack: piece_info.attack,
                attack_range_max: piece_info.attack_range_max,
                attack_range_min: piece_info.attack_range_min,
                speed: piece_info.speed,
                special: piece_info.special,
                special_range_max: piece_info.special_range_max,
                special_range_min: piece_info.special_range_min,
            },
        }
        all_pieces.push(parsed_piece);
    }
    return all_pieces;
}