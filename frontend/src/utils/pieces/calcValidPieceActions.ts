import { Piece, Map, CellStatus, PieceActions } from "../../types";
import getCellStatus from "../getCellStatus";
import getPiece from "./getPiece";

// ----------------------------------------------------------------------

const operations = [['plus', ''], ['minus', ''], ['', 'plus'], ['', 'minus'], ['plus', 'plus'], ['minus', 'minus'], ['plus', 'minus'], ['minus', 'plus']]

export function calcValidPieceMoves (piece: Piece, map: Map, location: number[], objectives: string[]) {
    let possible_move_locations: number[][] = [];
    const row_length = (map.data[0]).length;
    const column_length = (map.data).length;

    const current_column_location: number = location[0];
    const current_row_location: number = location[1];
    const speed_array: number[] = Array.from(Array(piece.current_stats.speed).keys());

    function pushLocations (speed_array: number[], row_change_type: string, column_change_type: string) {
        for (let index in speed_array) {
            const current_range: number = speed_array[index] + 1;
            const row_location = (row_change_type === 'plus') ? (current_row_location + current_range) : ((row_change_type === 'minus') ? (current_row_location - current_range) : current_row_location);
            const column_location = (column_change_type === 'plus') ? (current_column_location + current_range) : ((column_change_type === 'minus') ? (current_column_location - current_range) : current_column_location);
            if ((row_location < (row_length) && row_location >= 0) && (column_location < (column_length) && column_location >= 0)) {
                const new_location = [column_location, row_location];
                const cell_status: CellStatus = getCellStatus(objectives, map.data, new_location);
                if (!cell_status.contains_wall && !cell_status.contains_piece) {
                    possible_move_locations.push(new_location);
                }
                else { break };
            } else { break };
        }
    }

    for (let index in operations) {
        pushLocations(speed_array, operations[index][0], operations[index][1])
    }
    return possible_move_locations;
};

export function calcValidPieceAttacks (piece: Piece, pieces: Piece[], map: Map, location: number[], objectives: string[]) {
    let possible_attack_locations: number[][] = [];
    const row_length = (map.data[0]).length;
    const column_length = (map.data).length;

    const current_column_location: number = location[0];
    const current_row_location: number = location[1];
    const attack_array: number[] = Array.from(Array(piece.current_stats.attack_range_max).keys());

    function pushLocations (attack_array: number[], row_change_type: string, column_change_type: string) {
        for (let index in attack_array) {
            const current_range: number = attack_array[index] + 1;
            if (current_range < piece.current_stats.attack_range_min) { continue };
            const row_location = (row_change_type === 'plus') ? (current_row_location + current_range) : ((row_change_type === 'minus') ? (current_row_location - current_range) : current_row_location);
            const column_location = (column_change_type === 'plus') ? (current_column_location + current_range) : ((column_change_type === 'minus') ? (current_column_location - current_range) : current_column_location);
            if ((row_location < (row_length) && row_location >= 0) && (column_location < (column_length) && column_location >= 0)) {
                const new_location = [column_location, row_location];
                const cell_status: CellStatus = getCellStatus(objectives, map.data, new_location);
                if (cell_status.contains_piece) {
                    const piece_target: Piece | undefined = getPiece(new_location, pieces);
                    if (piece_target && piece_target.player !== piece.player && piece.current_stats.attack > 0) {
                        possible_attack_locations.push(new_location);
                    };
                }
            } else { break };
        }
    }

    for (let index in operations) {
        pushLocations(attack_array, operations[index][0], operations[index][1])
    }
    return possible_attack_locations;
};

export function calcValidPieceSpecial (piece: Piece, pieces: Piece[], map: Map, location: number[], objectives: string[]) {
    let possible_special_locations: number[][] = [];
    const row_length = (map.data[0]).length;
    const column_length = (map.data).length;

    const current_column_location: number = location[0];
    const current_row_location: number = location[1];
    let special_array: number[] = Array.from(Array(piece.current_stats.special_range_max).keys());

    function pushLocations (special_array: number[], row_change_type: string, column_change_type: string) {
        for (let index in special_array) {
            const current_range: number = special_array[index] + 1;
            if (current_range < piece.current_stats.special_range_min) { continue };
            const row_location = (row_change_type === 'plus') ? (current_row_location + current_range) : ((row_change_type === 'minus') ? (current_row_location - current_range) : current_row_location);
            const column_location = (column_change_type === 'plus') ? (current_column_location + current_range) : ((column_change_type === 'minus') ? (current_column_location - current_range) : current_column_location);
            const new_location = [column_location, row_location];
            if ((row_location < (row_length) && row_location >= 0) && (column_location < (column_length) && column_location >= 0)) {
                const cell_status: CellStatus = getCellStatus(objectives, map.data, new_location);
                if (cell_status.contains_piece) {
                    const piece_target: Piece | undefined = getPiece(new_location, pieces);
                    if (piece_target && piece_target.player !== piece.player && (piece.current_stats.special > 0)) {
                        possible_special_locations.push(new_location);
                    };
                }
            } else { break };
        }
    }

    for (let index in operations) {
        pushLocations(special_array, operations[index][0], operations[index][1])
    }
    return possible_special_locations;
};


export function getActionLocations (action_type: PieceActions, move_locations: number[][], attack_locations: number[][], special_locations: number[][]) {
    if (action_type === 'move') { return move_locations }
    else if (action_type === 'melee attack' || action_type === 'range attack') { return attack_locations }
    else if (action_type.length > 0) { return special_locations }
    else { return undefined };
  };