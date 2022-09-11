import { Stack } from '@mui/material';
import Cell from './Cell';
import { useState, useEffect } from 'react';
import getStatusConstants from '../utils/getStatusConstants';
import getTileStatusVals from '../utils/getTileStatusVals';
import { Constants, Piece, Map } from '../types';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    pieces: Piece[],
    constants: Constants,
    map: Map,
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, constants, map }: Props) {
  
    const constants_vals = getStatusConstants();

    const column_nums = Array.from(Array(columns).keys());
    const row_nums = Array.from(Array(rows).keys());
    const [selectedTile, setSelectedTile] = useState<number[]>([]);

    useEffect(() => {}, [selectedTile])

    const updateSelectedTile = (location: number[]) => {
        if ((location[0] !== selectedTile[0]) || (location[1] !== selectedTile[1])) { setSelectedTile(location) }
        else if ((location[0] === selectedTile[0]) && (location[1] === selectedTile[1])) { setSelectedTile([]) };
        // printCellStatus(location, map.data);
    }

    const calcSelectedTile = (selected_tile: number[], current_tile: number[]) => {
        if ((selected_tile[0] === current_tile[0]) && (selected_tile[1] === current_tile[1])) { return true }
        else { return false }
    }

    return (
        <Stack spacing={0.25} direction={'row'}>
            {column_nums.map((column) => (
                <Stack key={column} spacing={0.25} direction={'column'}>
                    {row_nums.map((row) => (
                        <Cell
                            key={([row, column]).toString()}
                            location={[row, column]}
                            selected={calcSelectedTile(selectedTile, [row, column])}
                            updateSelectedTile={updateSelectedTile}
                            status={getTileStatusVals(map.data, row, column, constants_vals)}
                            pieces={pieces}
                            constants={constants}
                            map={map}
                        />
                    ))}
                </Stack>
            ))}
        </Stack>
    );
}

    // TEST FUNCTIONS

    // const printRows = (board: any[]) => {
    //     for (let index in board) {
    //         const row = board[index];
    //         console.log("ROW", index, row);
    //       };
    // }
    // printRows(board);

    // const printCellStatus = (location: number[], gameState: any[]) => {
    //     const constants_info = require('../testing/constants.json');
    //     const current_location = gameState[location[0]][location[1]];
    //     const constants_keys = Object.keys(constants_info);
    //     for (let index in constants_keys) {
    //       const key = constants_keys[index];
    //       if (constants_info[key as keyof typeof constants_info] === current_location) {
    //         console.log(`LOCATION: [${location}], CELL STATUS: ${key}, STATUS NUMBER: ${current_location}`);
    //         break;
    //       }
    //     };
    //   }