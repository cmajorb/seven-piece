import { Stack, Divider, useTheme, Button, Typography, Card, Paper } from '@mui/material';
import Cell from './Cell';
import { useState, useEffect } from 'react';
import { Piece, Map } from '../types';
import { PieceImg } from './getPNGImages';
import calcSelectedTile from '../utils/calcSelectedTile';
import checkSameLocation from '../utils/checkSameLocation';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    pieces: Piece[],
    map: Map,
    round: number,
    team_scores: number[]
    endTurn: any,
    submitPieceMove: any
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, map, round, team_scores, endTurn, submitPieceMove }: Props) {
    
    const theme = useTheme();

    const column_nums = (Array.from(Array(columns).keys()));
    // console.log("COLUMN NUMS", column_nums);
    const row_nums = (Array.from(Array(rows).keys())).sort((a, b) => b - a);
    // console.log("ROW NUMS", row_nums);
    const [selectedTile, setSelectedTile] = useState<number[]>([]);
    console.log("SElECTED TILE", selectedTile);
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
    useEffect(() => {}, [selectedTile])
    useEffect(() => {
        if (selectedPiece) { console.log("Currently Selected Piece:", selectedPiece) }
    }, [selectedPiece])

    const updateSelected = (location: number[], piece: Piece | undefined) => {
        const same_location = checkSameLocation(location, selectedTile);
        if (same_location) {
            setSelectedTile([]);
            setSelectedPiece(undefined);
        } else {
            if (selectedPiece) {
                console.log("OLD LOCATION:", selectedPiece.location);
                console.log("NEW LOCATION:", location);
                submitPieceMove(selectedPiece.id, location);
            }
            setSelectedTile(location);
            if (piece) {
                setSelectedPiece(piece)
            }
            else { setSelectedPiece(undefined) };
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
                                        cell_status={map.data[row][column]}
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
            <Divider flexItem color={theme.palette.common.black} />
            <Stack direction={'row'} spacing={2} alignContent={'center'} justifyContent={'space-around'}>
                <Typography variant='h6'>Round: {round}</Typography>
                <Stack direction={'row'} spacing={2}>
                    <Card sx={{ pl: 1, pr: 1 }}>
                        <Stack alignItems={'center'}>
                            <Typography variant='h5' fontWeight={'bold'}>{team_scores[0]}</Typography>
                            <Typography variant='h6'>Team 1</Typography>
                        </Stack>
                    </Card>
                    <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
                    <Card sx={{ pl: 1, pr: 1 }}>
                        <Stack alignItems={'center'}>
                            <Typography variant='h5' fontWeight={'bold'}>{[team_scores[1]]}</Typography>
                            <Typography variant='h6'>Team 2</Typography>
                        </Stack>
                    </Card>
                </Stack>
                <Button variant={'contained'} onClick={() => { console.log("ENDING TURN"); endTurn() }}>
                    End Turn
                </Button>
            </Stack>
        </Stack>
    );
}