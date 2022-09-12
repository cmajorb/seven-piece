import { Stack, Divider, useTheme, Button, Typography, Card } from '@mui/material';
import Cell from './Cell';
import { useState, useEffect } from 'react';
import getStatusConstants from '../utils/getStatusConstants';
import getTileStatusVals from '../utils/getTileStatusVals';
import { Constants, Piece, Map } from '../types';
import { PieceImg } from './getSVGImages';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    pieces: Piece[],
    constants: Constants,
    map: Map,
    round: number,
    team_1_score: number,
    team_2_score: number
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, constants, map, round, team_1_score, team_2_score }: Props) {
    
    const theme = useTheme();
    const constants_vals = getStatusConstants();

    const column_nums = Array.from(Array(columns).keys());
    const row_nums = Array.from(Array(rows).keys());
    const [selectedTile, setSelectedTile] = useState<number[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();

    useEffect(() => {}, [selectedTile])

    const updateSelected = (location: number[], piece: Piece | undefined) => {
        if ((location[0] !== selectedTile[0]) || (location[1] !== selectedTile[1])) {
            setSelectedTile(location);
            if (piece) { setSelectedPiece(piece) }
            else { setSelectedPiece(undefined) };
        }
        else if ((location[0] === selectedTile[0]) && (location[1] === selectedTile[1])) {
            setSelectedTile([]);
            setSelectedPiece(undefined);
        };
        // printCellStatus(location, map.data);
    }

    const calcSelectedTile = (selected_tile: number[], current_tile: number[]) => {
        if ((selected_tile[0] === current_tile[0]) && (selected_tile[1] === current_tile[1])) { return true }
        else { return false }
    }

    return (
        <Stack spacing={2}>
            <Stack direction={'row'} spacing={2} alignContent={'center'} justifyContent={'space-around'}>
                <Stack spacing={0.25} direction={'row'}>
                    {column_nums.map((column) => (
                        <Stack key={column} spacing={0.25} direction={'column'}>
                            {row_nums.map((row) => (
                                <Cell
                                    key={([row, column]).toString()}
                                    location={[row, column]}
                                    selected={calcSelectedTile(selectedTile, [row, column])}
                                    updateSelected={updateSelected}
                                    status={getTileStatusVals(map.data, row, column, constants_vals)}
                                    pieces={pieces}
                                    constants={constants}
                                    map={map}
                                />
                            ))}
                        </Stack>
                    ))}
                </Stack>
                <Divider orientation="vertical" flexItem color={theme.palette.common.black} />
                <Stack alignContent={'center'} sx={{ pt: 4 }}>
                    { selectedPiece ?
                    <Card sx={{ width: 300, height: 355 }}>
                        <Stack spacing={2} sx={{ p: 1 }} alignItems={'center'}>
                            <Typography variant='h6'>{selectedPiece.character}</Typography>
                            <Stack spacing={1}>
                                <PieceImg svg_image={selectedPiece.image} />
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
                            <Typography variant='h5' fontWeight={'bold'}>{team_1_score}</Typography>
                            <Typography variant='h6'>Team 1</Typography>
                        </Stack>
                    </Card>
                    <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
                    <Card sx={{ pl: 1, pr: 1 }}>
                        <Stack alignItems={'center'}>
                            <Typography variant='h5' fontWeight={'bold'}>{team_2_score}</Typography>
                            <Typography variant='h6'>Team 2</Typography>
                        </Stack>
                    </Card>
                </Stack>
                <Button variant={'contained'}>End Turn</Button>
            </Stack>
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