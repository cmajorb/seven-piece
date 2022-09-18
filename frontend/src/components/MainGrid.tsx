import { Stack, Divider, useTheme, Paper } from '@mui/material';
import Cell from './Cell';
import PieceDetails from './PieceDetails';
import { useState, useEffect } from 'react';
import { Piece, Map, PieceActions } from '../types';
import calcSelectedTile from '../utils/calcSelectedTile';
import checkSameLocation from '../utils/checkSameLocation';
import getCellStatus from '../utils/getCellStatus';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    pieces: Piece[],
    map: Map,
    active_turn: boolean,
    objectives: string[],
    submitPieceAction: any
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, map, active_turn, objectives, submitPieceAction }: Props) {
    
    const theme = useTheme();

    const column_nums = (Array.from(Array(columns).keys()));
    const row_nums = (Array.from(Array(rows).keys())).sort((a, b) => b - a);
    const [selectedTile, setSelectedTile] = useState<number[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
    const [actionType, setActionType] = useState<PieceActions>('move');
    useEffect(() => { setSelectedTile([]); setSelectedPiece(undefined) }, [active_turn]);
    useEffect(() => {}, [selectedTile]);
    useEffect(() => { if (selectedPiece) { console.log("Currently Selected Piece:", selectedPiece) } }, [selectedPiece]);

    const updateSelected = (location: number[], piece: Piece | undefined) => {
        const same_location = checkSameLocation(location, selectedTile);
        if (same_location) {
            setSelectedTile([]);
            setSelectedPiece(undefined);
        } else {
            if (selectedPiece) { submitPieceAction(selectedPiece.id, location, actionType) };
            setSelectedTile(location);
            if (piece) { setSelectedPiece(piece) } else { setSelectedPiece(undefined) };
        }
    }

    const handleActionType = (action_type: PieceActions) => { setActionType(action_type) };

    return (
        <Stack spacing={2}>
            <Stack direction={'row'} spacing={2} alignContent={'center'} justifyContent={'space-around'}>
                <Paper
                    sx={{ p: 1, backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")` }}
                    elevation={2}
                    onContextMenu={(e)=> e.preventDefault()}
                    onMouseDown={(e)=> e.preventDefault()}
                >
                    <Stack spacing={0.25} direction={'row'}>
                        {column_nums.map((column) => (
                            <Stack key={column} spacing={0.25} direction={'column'}>
                                {row_nums.map((row) => (
                                    <Cell key={([row, column]).toString()}
                                        location={[row, column]}
                                        selected={calcSelectedTile(selectedTile, [row, column])}
                                        cell_status={getCellStatus(objectives, map.data, [row, column])}
                                        pieces={pieces}
                                        updateSelected={updateSelected}
                                        color_scheme={map.color_scheme}
                                    />
                                ))}
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
                <Divider orientation="vertical" flexItem color={theme.palette.common.black} />
                <PieceDetails selected_piece={selectedPiece} selected_action={actionType} handleActionType={handleActionType} />
            </Stack>
        </Stack>
    );
}