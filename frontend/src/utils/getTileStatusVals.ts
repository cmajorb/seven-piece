export default function getTileStatusVals (board_base: [number[]], row: number, column: number, constants_vals: number[]) {
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