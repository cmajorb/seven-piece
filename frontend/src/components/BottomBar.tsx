import { Stack, Divider, useTheme, Typography, Card, Button } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
    round: number,
    team_scores: number[],
    this_player_id: number,
    endTurn: any,
};

// ----------------------------------------------------------------------

export default function BottomBar({ round, team_scores, this_player_id, endTurn }: Props) {
    
    const theme = useTheme();

    const current_player_id = round % 2 === 0 ? 1 : 0;

    return (
        <Stack spacing={2}>
            <Divider flexItem color={theme.palette.common.black} />
            <Stack direction={'row'} spacing={2} alignContent={'center'} justifyContent={'space-around'}>
                <Typography variant='h6'>Round: {round > -1 ? round : 0}</Typography>
                <Stack direction={'row'} spacing={2}>
                    <Card sx={{ pl: 1, pr: 1, ...((round > -1 && current_player_id === 0) && { border: 4, borderColor: theme.palette.primary.main }) }} variant="outlined">
                        <Stack alignItems={'center'}>
                            <Typography variant='h5' fontWeight={'bold'}>{team_scores[0]}</Typography>
                            <Typography variant='h6'>Team 1</Typography>
                        </Stack>
                    </Card>
                    <Divider orientation="vertical" variant="middle" flexItem color={theme.palette.common.black} />
                    <Card sx={{ pl: 1, pr: 1, ...((round > -1 && current_player_id === 1) && { border: 4, borderColor: theme.palette.primary.main }) }} variant="outlined">
                        <Stack alignItems={'center'}>
                            <Typography variant='h5' fontWeight={'bold'}>{team_scores[1]}</Typography>
                            <Typography variant='h6'>Team 2</Typography>
                        </Stack>
                    </Card>
                </Stack>
                <Button variant={'contained'} onClick={() => { console.log("ENDING TURN"); endTurn() }} disabled={(this_player_id !== current_player_id)}>
                    End Turn
                </Button>
            </Stack>
        </Stack>
    );
}