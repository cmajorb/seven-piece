import { useState, useEffect } from 'react';
import { Piece, Map } from '../types';
import { Box, Button, Grid, keyframes, Stack, Typography, useTheme } from '@mui/material';
import { TurnLine } from '../components/misc/DynamicLines';
import PieceInfoCard from './PieceInfoCard';
import { BG_COLOR, EDGE_COLOR, MIDDLE_COLOR } from '../utils/defaultColors';
import getPieceNames from '../utils/getPieceNames';
import checkIfTeamSubmitted from '../utils/checkIfTeamSubmitted';
import useKeyPress from '../utils/useKeyPress';

// ----------------------------------------------------------------------

type Props = {
    all_pieces: Piece[],
    all_selected_pieces: Piece[],
    num_allowed_pieces: number,
    game_state: string,
    map: Map,
    this_player_id: number,
    setPieces: any,
    endTurn: any,
};

// ----------------------------------------------------------------------

export default function SelectPieces({ all_pieces, all_selected_pieces, game_state, num_allowed_pieces, map, this_player_id, setPieces, endTurn }: Props) {

    const theme = useTheme();
    const [selectedTeam, setSelectedTeam] = useState<Piece[]>([]);
    const select_team_seconds = 100;
    const begin_game_ready: boolean = (all_selected_pieces.length === (num_allowed_pieces * 2));
    const submit_team_ready: boolean = (
        (selectedTeam.length === num_allowed_pieces) &&
        (game_state !== 'WAITING') &&
        (!checkIfTeamSubmitted(all_selected_pieces, this_player_id))
    );

    const dots_waiting = (
        keyframes`
        0% {
            opacity: 35%;
        }
        100% {
            opacity: 100%;
        }`
    );

    const onKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            if (submit_team_ready) {
                setPieces(JSON.stringify(getPieceNames(selectedTeam)));
            } else if (begin_game_ready) {
                endTurn();
            }
        };
    };
    useKeyPress(['Enter'], onKeyPress);

    const transferTeam = (piece: Piece) => {
        let team: Piece[] = Array.from(selectedTeam);

        if (team.includes(piece)) {
            if (team.length === 1) { setSelectedTeam([]) }
            else {
                const piece_index = team.indexOf(piece);
                team.splice(piece_index, 1);
                setSelectedTeam(team);
            }
        } else {
            if (team.length < num_allowed_pieces) { setSelectedTeam(team.concat([piece])) }
            else { console.log("Too many pieces on team.") };
        }
    };

    useEffect(() => {}, [selectedTeam]);

    return (
        <Stack spacing={3} justifyContent={'center'} alignItems={'center'}>
            <TurnLine
                is_turn={game_state === 'WAITING' ? false : true}
                bg_color={BG_COLOR}
                middle_color={MIDDLE_COLOR}
                edge_color={EDGE_COLOR}
                turn_seconds={select_team_seconds}
            />
            { begin_game_ready ?
            <Button variant={'contained'} disabled={!begin_game_ready} onClick={() => { endTurn() }}>
                Begin Game
            </Button> :
            <Stack spacing={2} justifyContent={'center'}>
                <Typography variant='h5' fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[300]}>Pieces Selected: {selectedTeam.length}/{num_allowed_pieces}</Typography>
                <Button variant={'contained'} disabled={submit_team_ready ? false : true} onClick={() => { setPieces(JSON.stringify(getPieceNames(selectedTeam))) }}>
                    Submit Pieces
                </Button>
            </Stack> }
            <Box sx={{ pl: '10%' }}>
                <Grid container spacing={4}>
                    {all_pieces.map((piece) => (
                        <Grid item xs={1} sm={2} md={4} key={piece.name}>
                            <PieceInfoCard
                                observed_piece={piece}
                                team_pick_option={true}
                                team_picked={selectedTeam.includes(piece) ? true : false}
                                transferTeam={transferTeam}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                    <div style={{ backgroundColor: `#${EDGE_COLOR}`, borderRadius: '50%', width: '10px', height: '10px' }}/>
                </Stack>
                <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                    <div style={{ backgroundColor: `#${EDGE_COLOR}`, borderRadius: '50%', width: '10px', height: '10px' }}/>
                </Stack>
                <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                    <div style={{ backgroundColor: `#${EDGE_COLOR}`, borderRadius: '50%', width: '10px', height: '10px' }}/>
                </Stack>
            </Stack>            
        </Stack>
    );
};