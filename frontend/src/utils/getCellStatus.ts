import { Constants, CellStatus } from "../types";

// ----------------------------------------------------------------------

export default function getCellStatus (cell_status: number) {
    const constants: Constants = require('../testing/constants.json');
    const is_empty: boolean = (cell_status & constants.empty) === constants.empty;
    const contains_wall: boolean = (cell_status & constants.wall) === constants.wall;
    const contains_piece: boolean = (cell_status & constants.player) === constants.player;
    const contains_objective: boolean = (cell_status & constants.objective) === constants.objective;
    if (contains_objective) {
        // flatten array of map, and find which objective this is. Use that to index all objectives from map, and then return the objective's owner.
    }
    const complete_status: CellStatus = {
        'is_empty': is_empty,
        'contains_wall': contains_wall,
        'contains_piece': contains_piece,
        'contains_objective': contains_objective,
    }
    return complete_status;
}