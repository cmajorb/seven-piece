import { Box, Stack, Button, useTheme } from '@mui/material';
import { ColorScheme } from '../../types';
import GetBorderColor from '../../utils/getBorderColor';
import Iconify from '../misc/Iconify';
import useKeyPress from '../../utils/useKeyPress';

// ----------------------------------------------------------------------

type Props = {
  active_player_id: number | undefined,
  this_player_id: number,
  color_scheme: ColorScheme,
  current_state: string,
  endTurn: any,
  setPieces: any,
};

// ----------------------------------------------------------------------

export default function BBarActionArea({ this_player_id, color_scheme, active_player_id, current_state, endTurn, setPieces }: Props) {

    const theme = useTheme();

    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === 'e') { endTurn() };
    };
    useKeyPress(['e'], onKeyPress);

    return (
        <>
            { (active_player_id !== undefined && active_player_id === 1 && current_state === 'PLAYING') ?
                <Box sx={{ width: 60, height: 60 }}/> :
                <>
                { active_player_id !== undefined && current_state === 'PLAYING' &&
                <Box sx={{ width: 60, height: 60, backgroundColor: 'black', border: 2, borderRadius: '10px', borderColor: theme.palette.grey[700] }}>
                    <Iconify
                    icon={'eva:arrowhead-left-outline'}
                    width={60}
                    height={60}
                    color={GetBorderColor(color_scheme, active_player_id, true)}
                    />
                </Box> }
                </> 
            }

            <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                { current_state === 'PLACING' &&
                <Button fullWidth variant={'contained'} onClick={() => { setPieces(JSON.stringify(["Soldier", "Berserker"])) }}>
                    Place Pieces
                </Button> }
                <Button fullWidth variant={'contained'} onClick={() => { endTurn() }} disabled={(this_player_id !== active_player_id)}>
                    End Turn
                </Button>
            </Stack>

            { (active_player_id !== undefined && active_player_id === 0 && current_state === 'PLAYING') ?
                <Box sx={{ width: 60, height: 60 }}/> :
                <>
                { active_player_id !== undefined && current_state === 'PLAYING' &&
                <Box sx={{ width: 60, height: 60, backgroundColor: 'black', border: 2, borderRadius: '10px', borderColor: theme.palette.grey[700] }}>
                    <Iconify
                    icon={'eva:arrowhead-right-outline'}
                    width={60}
                    height={60}
                    color={GetBorderColor(color_scheme, active_player_id, true)}
                    />
                </Box> }
                </> 
            }
        </>
    );
}