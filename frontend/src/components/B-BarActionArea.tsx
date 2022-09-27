import { Box, Stack, Button } from '@mui/material';
import { ColorScheme } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import Iconify from './Iconify';

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

  return (
    <>
        { (active_player_id !== undefined && active_player_id === 1) ?
            <Box sx={{ width: 70, height: 70 }}/> :
            <>
            { active_player_id !== undefined &&
            <Box sx={{ width: 70, height: 70 }}>
                <Iconify
                icon={'eva:arrowhead-left-outline'}
                width={70}
                height={70}
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

        { (active_player_id !== undefined && active_player_id === 0) ?
            <Box sx={{ width: 70, height: 70 }}/> :
            <>
            { active_player_id !== undefined &&
            <Box sx={{ width: 70, height: 70 }}>
                <Iconify
                icon={'eva:arrowhead-right-outline'}
                width={70}
                height={70}
                color={GetBorderColor(color_scheme, active_player_id, true)}
                />
            </Box> }
            </> 
        }
    </>
  );
}