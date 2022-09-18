import { Stack, Divider, useTheme, Typography, Card, Paper } from '@mui/material';
import Cell from './Cell';
import { useState, useEffect } from 'react';
import { Piece, Map } from '../types';
import { PieceImg } from './getPNGImages';
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
    submitPieceMove: any
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, map, active_turn, submitPieceMove }: Props) {
    
    const theme = useTheme();

    const column_nums = (Array.from(Array(columns).keys()));
    const row_nums = (Array.from(Array(rows).keys())).sort((a, b) => b - a);
    const [selectedTile, setSelectedTile] = useState<number[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
    useEffect(() => { setSelectedTile([]); setSelectedPiece(undefined); console.log("ACTIVE TURN", active_turn) }, [active_turn]);
    useEffect(() => {}, [selectedTile]);
    useEffect(() => {
        if (selectedPiece) { console.log("Currently Selected Piece:", selectedPiece) }
    }, [selectedPiece]);

    const updateSelected = (location: number[], piece: Piece | undefined) => {
        const same_location = checkSameLocation(location, selectedTile);
        if (same_location) {
            setSelectedTile([]);
            setSelectedPiece(undefined);
        } else {
            if (selectedPiece) { submitPieceMove(selectedPiece.id, location) };
            setSelectedTile(location);
            if (piece) { setSelectedPiece(piece) } else { setSelectedPiece(undefined) };
        }
    }

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
                                        cell_status={getCellStatus(map.data[row][column])}
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
                <Stack alignContent={'center'} sx={{ pt: 1 }}>
                    { selectedPiece ?
                    <Card sx={{ width: 300, height: 570 }}>
                        <Stack spacing={2} sx={{ p: 1 }} alignItems={'center'}>
                            <Typography variant='h6'>{selectedPiece.character}</Typography>
                            <Stack spacing={1}>
                                <PieceImg piece_name={selectedPiece.character} on_board={false} />
                                <Divider variant="middle" flexItem color={theme.palette.common.black} />
                                <Typography variant='h6'>Attack: {selectedPiece.attack}</Typography>
                                <Typography variant='h6'>Health: {selectedPiece.health}</Typography>
                                <Typography variant='h6'>Range: {selectedPiece.range}</Typography>
                                { selectedPiece.description && 
                                <Stack spacing={1}>
                                    <Divider variant="middle" flexItem color={theme.palette.common.black} />
                                    <Stack>
                                        {((selectedPiece.description).split("n/")).map((line) => (
                                            <Typography key={line} paragraph variant='body1'>{line}</Typography>
                                        ))}
                                    </Stack>
                                </Stack> }
                            </Stack>
                        </Stack>
                    </Card> : <Card sx={{ width: 300, height: 355, bgcolor: theme.palette.grey[200] }}></Card> }
                </Stack>
            </Stack>
        </Stack>
    );
}