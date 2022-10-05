import { Piece, Map, CellStatus } from "../types";
import getCellStatus from "./getCellStatus";

// ----------------------------------------------------------------------

export default function calcValidPieceMoves (piece: Piece, map: Map, location: number[], objectives: string[]) {
    let move_possible_locations: number[][] = [];
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
                    move_possible_locations.push(new_location);
                }
                else { break };
            } else { break };
        }
    }

    const operations = [['plus', ''], ['minus', ''], ['', 'plus'], ['', 'minus'], ['plus', 'plus'], ['minus', 'minus'], ['plus', 'minus'], ['minus', 'plus']]
    for (let index in operations) {
        pushLocations(speed_array, operations[index][0], operations[index][1])
    }
    return move_possible_locations;
};