import { useState, useEffect } from 'react';
import { Piece, Map, GameStatus } from '../types';
import { Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import PieceInfoCard from './PieceInfoCard';
import getPieceNames from '../utils/getPieceNames';
import checkIfTeamSubmitted from '../utils/checkIfTeamSubmitted';
import useKeyPress from '../utils/useKeyPress';
import WaitingDots from './misc/WaitingDots';
import useWebSocket from 'react-use-websocket';
import { PathStr, endTurn } from '../utils/sendJsonMessages';

// ----------------------------------------------------------------------

type Props = {
    all_pieces: Piece[],
    all_selected_pieces: Piece[],
    num_allowed_pieces: number,
    game_state: GameStatus,
    map: Map,
    this_player_id: number,
    setPieces: any,
};

// ----------------------------------------------------------------------

export default function SelectPieces({ all_pieces, all_selected_pieces, game_state, num_allowed_pieces, map, this_player_id, setPieces }: Props) {

    const { sendJsonMessage } = useWebSocket('ws://' + process.env.REACT_APP_DJANGO_URL + PathStr(), {share: true});

    const theme = useTheme();
    const [selectedTeam, setSelectedTeam] = useState<Piece[]>([]);
    const team_submitted: boolean = checkIfTeamSubmitted(all_selected_pieces, this_player_id);
    const begin_game_ready: boolean = (all_selected_pieces.length === (num_allowed_pieces * 2));
    const submit_team_ready: boolean = (
        (selectedTeam.length === num_allowed_pieces) &&
        (game_state !== 'WAITING') &&
        (!team_submitted)
    );
    const waiting_for_other_player: boolean = team_submitted && !begin_game_ready;

    const onKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            if (submit_team_ready) {
                setPieces(JSON.stringify(getPieceNames(selectedTeam)));
            } else if (begin_game_ready) {
                endTurn(sendJsonMessage);
            }
        };
    };
    useKeyPress(['Enter'], onKeyPress);

    const transferTeam = (piece: Piece) => {
        if (game_state !== 'WAITING') {
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
            };
        };
    };

    useEffect(() => {}, [selectedTeam]);

    return (
        <Stack spacing={3} justifyContent={'center'} alignItems={'center'} sx={{ position: 'relative', pt: '5%', pb: '10%' }}>
            { begin_game_ready ?
            <Button variant={'contained'} sx={{ fontFamily: 'fantasy', fontWeight: 'bold' }} onClick={() => { endTurn(sendJsonMessage) }}>
                Begin Game
            </Button> :
            <Stack spacing={2} justifyContent={'center'}>
                <Typography variant='h5' fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[300]}>Pieces Selected: {selectedTeam.length}/{num_allowed_pieces}</Typography>
                { waiting_for_other_player ? <WaitingDots /> :
                <Button
                    variant={'contained'}
                    sx={{ fontFamily: 'fantasy', fontWeight: 'bold' }}
                    disabled={submit_team_ready ? false : true}
                    onClick={() => { setPieces(JSON.stringify(getPieceNames(selectedTeam))) }}
                >
                    Submit Pieces
                </Button> }
            </Stack> }
            <Grid container justifyContent={'space-around'} alignItems={'center'} rowSpacing={4} columnSpacing={4} columns={{ xs: 1, sm: 1, md: 3, lg: 5, xl: 7 }} sx={{ width: '100%' }}>
                {all_pieces.map((piece) => (
                    <Grid item key={piece.name} justifyContent={'center'} alignItems={'center'} sx={{ pr: '32px' }}>
                        <PieceInfoCard
                            observed_piece={piece}
                            team_pick_option={true}
                            team_picked={selectedTeam.includes(piece) ? true : false}
                            transferTeam={transferTeam}
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};