import { Stack, Divider, useTheme, Typography, Card, Button } from '@mui/material';
import useKeyPress from '../utils/useKeyPress';

// ----------------------------------------------------------------------

type Props = {
    round: number,
    team_scores: number[],
    this_player_id: number,
    current_state: string,
    endTurn: any,
    setPieces: any
};

// ----------------------------------------------------------------------

export default function CommandBar({ round, team_scores, this_player_id, current_state, endTurn, setPieces }: Props) {
    
    const theme = useTheme();
    const current_player_id = round % 2 === 0 ? 1 : 0;

    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === 'e') { endTurn() };
    };
    useKeyPress(['e'], onKeyPress);

    return (
        <Stack direction={'row'} spacing={20} justifyContent={'space-around'} alignItems={'center'}>
            <Stack direction={'row'} spacing={2}>
                <Card sx={{ display:'flex', justifyContent:'center', pl: 1, pr: 1, ...((round > -1 && current_player_id === 0) && { border: 4, borderColor: theme.palette.primary.main }), ...((team_scores[0] < 0) && { backgroundColor: theme.palette.grey[100], color: theme.palette.grey[500] }) }} variant="outlined">
                    <Stack alignItems={'center'} justifyContent={'center'}>
                        { (team_scores[0] >= 0) && <Typography variant='h5' fontWeight={'bold'}>{team_scores[0]}</Typography> }
                        <Typography variant='h6'>Team 1</Typography>
                    </Stack>
                </Card>
                <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
                <Card sx={{ display:'flex', justifyContent:'center', pl: 1, pr: 1, ...((round > -1 && current_player_id === 1) && { border: 4, borderColor: theme.palette.primary.main }), ...((team_scores[1] < 0) && { backgroundColor: theme.palette.grey[100], color: theme.palette.grey[500] }) }} variant="outlined">
                    <Stack alignItems={'center'} justifyContent={'center'}>
                        { (team_scores[1] >= 0) && <Typography variant='h5' fontWeight={'bold'}>{team_scores[1]}</Typography> }
                        <Typography variant='h6'>Team 2</Typography>
                    </Stack>
                </Card>
            </Stack>
            { current_state === 'PLACING' &&
            <Button variant={'contained'} onClick={() => { setPieces(JSON.stringify(["Soldier", "Berserker"])) }}>
                Place Pieces
            </Button>
            }
            <Button variant={'contained'} onClick={() => { endTurn() }} disabled={(this_player_id !== current_player_id)}>
                End Turn
            </Button>
            <Typography variant='h6'>Round: {round > -1 ? round : 0}</Typography>
        </Stack>
    );
}