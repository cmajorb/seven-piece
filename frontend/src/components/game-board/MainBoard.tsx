import { Stack } from '@mui/material';
import Cell from './Cell';
import { Piece, Map } from '../../types';
import calcSelectedTile from '../../utils/calcSelectedTile';
import getCellStatus from '../../utils/getCellStatus';

// ----------------------------------------------------------------------

type Props = {
    pieces: Piece[],
    map: Map,
    selected_tile: number[],
    this_player_id: number,
    objectives: string[],
    selected_piece_actions: number[][] | undefined,
    updateSelected: any,
};

// ----------------------------------------------------------------------

export default function MainGrid({ pieces, map, objectives, selected_tile, this_player_id, selected_piece_actions, updateSelected }: Props) {
    
    const row_length: number = map.data.length;
    const row_nums: number[] = (Array.from(Array(row_length).keys())).sort((a, b) => b - a);

    const column_length: number = map.data[0].length;
    const column_nums: number[] = (Array.from(Array(column_length).keys()));

    return (
        <>
            { pieces &&
            <Stack spacing={20}>
                <Stack spacing={0.25} direction={'row'}>
                    {column_nums.map((column) => (
                        <Stack key={column} spacing={0.25} direction={'column'}>
                            {row_nums.map((row) => (
                                <Cell key={([row, column]).toString()}
                                    location={[row, column]}
                                    selected={calcSelectedTile(selected_tile, [row, column])}
                                    selected_piece_actions={selected_piece_actions}
                                    cell_status={getCellStatus(objectives, map.data, [row, column])}
                                    pieces={pieces}
                                    color_scheme={map.color_scheme}
                                    this_player_id={this_player_id}
                                    updateSelected={updateSelected}
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
            </Stack> }
        </>
    );
}