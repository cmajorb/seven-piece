import { Stack, Typography, Button } from '@mui/material';
import useKeyPress from '../utils/useKeyPress';

// ----------------------------------------------------------------------

type Props = {
    round: number,
    this_player_id: number,
    current_state: string,
    display_turn: number,
    endTurn: any,
    setPieces: any
};

// ----------------------------------------------------------------------

export default function CommandBar({ round, this_player_id, current_state, display_turn, endTurn, setPieces }: Props) {

    const current_player_id: number = round % 2 !== 0 ? 1 : 0;

    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === 'e') { endTurn() };
    };
    useKeyPress(['e'], onKeyPress);

    return (
        <Stack direction={'row'} spacing={20} justifyContent={'space-around'} alignItems={'center'}>
            { current_state === 'PLACING' &&
            <Button variant={'contained'} onClick={() => { setPieces(JSON.stringify(["Soldier", "Berserker"])) }}>
                Place Pieces
            </Button>
            }
            <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                <Typography variant='h6'>Round: {display_turn > -1 ? display_turn : 0}</Typography>
                <Button variant={'contained'} onClick={() => { endTurn() }} disabled={(this_player_id !== current_player_id)}>
                    End Turn
                </Button>
            </Stack>
        </Stack>
    );
}