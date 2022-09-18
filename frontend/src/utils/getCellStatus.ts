import { Constants, CellStatus } from "../types";

// ----------------------------------------------------------------------

export default function getCellStatus (objectives: string[], map: [number[]], location: number[]) {
    const cell_status = map[location[0]][location[1]];
    const constants: Constants = require('../testing/constants.json');
    const is_empty: boolean = (cell_status & constants.empty) === constants.empty;
    const contains_wall: boolean = (cell_status & constants.wall) === constants.wall;
    const contains_piece: boolean = (cell_status & constants.player) === constants.player;
    const contains_objective: boolean = (cell_status & constants.objective) === constants.objective;
    let objective_owner: number | undefined = undefined;
    if (contains_objective) {
        const flat_map = map.flat();
        const flat_location = (location[1] * map.length) + location[0];
        let objective_cells = 0;
        for (let index in flat_map) {
            if (parseInt(index) === flat_location) { break };
            const cell_stat = flat_map[index];
            if ((cell_stat & constants.objective) === constants.objective) {
                objective_cells++;
            }
        }
        objective_owner = parseInt(objectives[objective_cells]);
    }
    const complete_status: CellStatus = {
        'is_empty': is_empty,
        'contains_wall': contains_wall,
        'contains_piece': contains_piece,
        'contains_objective': contains_objective,
        'objective_owner': objective_owner,
    }
    return complete_status;
}