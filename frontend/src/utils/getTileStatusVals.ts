import { Constants } from "../types";

export function getStatusConstants (constants: Constants) {
    const constants_keys = Object.keys(constants);
    let constants_vals = [];
    for (let index in constants_keys) {
        const key = constants_keys[index];
        constants_vals.push(constants[key as keyof Constants] as number);
    };
    constants_vals.sort((a, b) => b - a);
    return constants_vals;
  }

export function getTileStatusVals (board_base: [number[]], row: number, column: number, constants_vals: number[]) {
    let current_status_vals = [];
    let tile_status_val = board_base[row][column];
    for (let index in constants_vals) {
        const constant_val = constants_vals[index];
        let val_dif = tile_status_val - constant_val;
        if (val_dif < 0 || (val_dif % 1) !== 0) { continue }
        else if ((val_dif % 1) === 0 && val_dif >= 0) {
            current_status_vals.push(constant_val);
            tile_status_val = tile_status_val - constant_val;
        };
    };
    return current_status_vals;
  }