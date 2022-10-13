import { Box, Stack, Button } from '@mui/material';
import { ColorScheme, GameStatus } from '../../types';
import useKeyPress from '../../utils/useKeyPress';
import { ObjectiveImg } from '../misc/PNGImages';
import LeftArrow from '../../images/backward-arrow.svg';
import RightArrow from '../../images/forward-arrow.svg';

// ----------------------------------------------------------------------

type Props = {
  active_player_id: number | undefined,
  this_player_id: number,
  color_scheme: ColorScheme,
  current_state: GameStatus,
  score_to_win: number,
  endTurn: any,
  setPieces: any,
};

// ----------------------------------------------------------------------

export default function BBarActionArea({ this_player_id, active_player_id, current_state, score_to_win, endTurn, setPieces }: Props) {

    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === 'e') { endTurn() };
    };
    useKeyPress(['e'], onKeyPress);

    const banner_height = 90;
    const banner_width = banner_height * 0.8;

    return (
        <>
            { (active_player_id !== undefined && active_player_id === 1 && current_state === 'PLAYING') ?
                <Box sx={{ width: banner_width, height: banner_height }}>
                    <ObjectiveImg player_id={-1} width={banner_width} height={banner_height} req_score={score_to_win}/>
                </Box> :
                <>
                    { active_player_id !== undefined && current_state === 'PLAYING' && 
                    <img
                        alt={'left'}
                        src={LeftArrow}
                        width={70}
                        height={70}
                    /> }
                </> 
            }

            <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                { current_state === 'PLACING' &&
                <Button fullWidth variant={'contained'} onClick={() => { endTurn() }}>
                    Place Pieces
                </Button> }
                { current_state !== 'PLACING' &&
                <Button fullWidth variant={'contained'} onClick={() => { endTurn() }} disabled={(this_player_id !== active_player_id)}>
                    End Turn
                </Button> }
            </Stack>

            { (active_player_id !== undefined && active_player_id === 0 && current_state === 'PLAYING') ?
                <Box sx={{ width: banner_width, height: banner_height }}>
                    <ObjectiveImg player_id={-1} width={banner_width} height={banner_height} req_score={score_to_win}/>
                </Box> :
                <>
                    { active_player_id !== undefined && current_state === 'PLAYING' && 
                    <img
                        alt={'right'}
                        src={RightArrow}
                        width={70}
                        height={70}
                    /> }
                </> 
            }
        </>
    );
}