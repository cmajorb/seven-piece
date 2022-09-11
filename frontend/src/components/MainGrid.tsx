import { Stack } from '@mui/material';
import Cell from './Cell';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    board: any[],
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, board }: Props) {
  
    const constants_info = require('../testing/constants.json');

    const column_nums = Array.from(Array(columns).keys());
    const row_nums = Array.from(Array(rows).keys());
    const [selectedTile, setSelectedTile] = useState<number[]>([]);

    useEffect(() => {}, [selectedTile])

    const printCellStatus = (location: number[], gameState: any[], constants_info: any) => {
        const current_location = gameState[location[0]][location[1]];
        const constants_keys = Object.keys(constants_info);
        for (let index in constants_keys) {
          const key = constants_keys[index];
          if (constants_info[key as keyof typeof constants_info] === current_location) {
            console.log(`LOCATION: [${location}], CELL STATUS: ${key}, STATUS NUMBER: ${current_location}`);
            break;
          }
        };
      }

    const updateSelectedTile = (location: number[]) => {
        console.log(`SELECTED: [${selectedTile[0]},${selectedTile[1]}]`, `CLICKED: [${location[0]},${location[1]}]`);
        if ((location[0] !== selectedTile[0]) || (location[1] !== selectedTile[1])) { setSelectedTile(location) }
        else if ((location[0] === selectedTile[0]) && (location[1] === selectedTile[1])) { setSelectedTile([]) };
        printCellStatus(location, board, constants_info);
    }

    const calcSelectedTile = (selected_tile: number[], current_tile: number[]) => {
        if ((selected_tile[0] === current_tile[0]) && (selected_tile[1] === current_tile[1])) { return true }
        else { return false }
    }

    // TEST FUNCTION
    // const printRows = (board: any[]) => {
    //     for (let index in board) {
    //         const row = board[index];
    //         console.log("ROW", index, row);
    //       };
    // }
    // printRows(board);

    return (
        <Stack spacing={0.25} direction={'row'}>
            {column_nums.map((column) => (
                <Stack spacing={0.25} direction={'column'}>
                    {row_nums.map((row) => (
                        <Cell location={[row, column]} gameState={board} selected={calcSelectedTile(selectedTile, [row, column])} updateSelectedTile={updateSelectedTile}/>
                    ))}
                </Stack>
            ))}
        </Stack>
    );
}