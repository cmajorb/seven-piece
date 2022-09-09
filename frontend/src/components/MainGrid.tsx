import { Stack } from '@mui/material';
import Cell from './Cell';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    board: any[],
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, board }: Props) {
  
    const column_nums = Array.from(Array(columns).keys());
    const row_nums = Array.from(Array(rows).keys());

    // TEST FUNCTION
    const printRows = (board: any[]) => {
        for (let index in board) {
            const row = board[index];
            console.log("ROW", index, row);
          };
    }
    printRows(board);

    return (
        <Stack spacing={0.25} direction={'row'}>
            {column_nums.map((column) => (
                <Stack spacing={0.25} direction={'column'}>
                    {row_nums.map((row) => (
                        <Cell location={[row, column]} gameState={board}/>
                    ))}
                </Stack>
            ))}
        </Stack>
    );
}