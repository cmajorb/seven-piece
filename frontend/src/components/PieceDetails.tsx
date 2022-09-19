import { Stack, Divider, useTheme, Typography, Card, Button } from '@mui/material';
import { Piece, PieceActions } from '../types';
import { PieceImg } from './getPNGImages';

// ----------------------------------------------------------------------

type Props = {

    selected_piece: Piece | undefined,
    selected_action: PieceActions,
    this_player_id: number,
    active_turn: boolean,
    handleActionType: any
};

// ----------------------------------------------------------------------

export default function PieceDetails({ selected_piece, selected_action, this_player_id, active_turn, handleActionType }: Props) {
    const theme = useTheme();
    const EDIT_BUTTON = theme.palette?.mode === 'light' ? theme.palette.grey['300'] : theme.palette.grey['800'];
    const EDIT_BUTTON_TEXT = theme.palette?.mode === 'dark' ? theme.palette.grey['300'] : theme.palette.grey['800'];

    return (
        <Stack alignContent={'center'} sx={{ pt: 1 }}>
            { selected_piece ?
            <Stack spacing={2}>
                <Card sx={{ width: 300, height: 570 }}>
                    <Stack spacing={2} sx={{ p: 1 }} alignItems={'center'}>
                        <Typography variant='h6'>{selected_piece.character}</Typography>
                        <Stack spacing={1}>
                            <PieceImg piece_name={selected_piece.character} on_board={false} />
                            <Divider variant="middle" flexItem color={theme.palette.common.black} />
                            <Typography variant='h6'>Attack: {selected_piece.attack}</Typography>
                            <Typography variant='h6'>Health: {selected_piece.health}</Typography>
                            <Typography variant='h6'>Range: {selected_piece.speed}</Typography>
                            { selected_piece.description && 
                            <Stack spacing={1}>
                                <Divider variant="middle" flexItem color={theme.palette.common.black} />
                                <Stack>
                                    {((selected_piece.description).split("n/")).map((line) => (
                                        <Typography key={line} paragraph variant='body1'>{line}</Typography>
                                    ))}
                                </Stack>
                            </Stack> }
                        </Stack>
                    </Stack>
                </Card>
                { active_turn && (this_player_id === selected_piece.player) &&
                <>
                    <Button variant={'contained'} onClick={() => { handleActionType('move') }} disabled={selected_piece.speed < 1} sx={{ ...(selected_action === 'attack' && { backgroundColor: EDIT_BUTTON, color: EDIT_BUTTON_TEXT }) }}>
                        Move
                    </Button>
                    <Button variant={'contained'} onClick={() => { handleActionType('attack') }} disabled={selected_piece.attack < 1} sx={{ ...(selected_action === 'move' && { backgroundColor: EDIT_BUTTON, color: EDIT_BUTTON_TEXT }) }}>
                        Attack
                    </Button>
                </> }
            </Stack> : <Card sx={{ width: 300, height: 355, bgcolor: theme.palette.grey[200] }}></Card> }
        </Stack>
    );
}