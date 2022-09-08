import { Stack } from '@mui/material';
import Cell from './Cell';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns }: Props) {
  
  const column_nums = Array.from(Array(columns).keys());
  const row_nums = Array.from(Array(rows).keys());

  return (
    <Stack spacing={0.25} direction={'row'}>
        {column_nums.map((column) => (
            <Stack spacing={0.25} direction={'column'}>
                {row_nums.map((row) => (
                    <Cell location={[row, column]} fillImageURL={'https://d36mxiodymuqjm.cloudfront.net/website/nav/icon_nav_battle_active@2x.png'}/>
                ))}
            </Stack>
        ))}
    </Stack>
  );
}