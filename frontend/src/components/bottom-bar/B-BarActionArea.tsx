import { Box, Stack, Button } from '@mui/material';
import { ColorScheme, GameStatus } from '../../types';
import useKeyPress from '../../utils/useKeyPress';
import LeftArrow from '../../images/backward-arrow.svg';
import RightArrow from '../../images/forward-arrow.svg';
import WaitingDots from '../misc/WaitingDots';
import useWebSocket from 'react-use-websocket';
import { endTurn, PathStr } from '../../utils/sendJsonMessages';

// ----------------------------------------------------------------------

type Props = {
    bar_height: number,
    active_player_id: number | undefined,
    this_player_id: number,
    color_scheme: ColorScheme,
    current_state: GameStatus,
    this_player_ready: boolean,
};

// ----------------------------------------------------------------------

export default function BBarActionArea({ bar_height, this_player_id, active_player_id, current_state, this_player_ready }: Props) {

    const { sendJsonMessage } = useWebSocket('ws://' + process.env.REACT_APP_DJANGO_URL + PathStr(), {share: true});

    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === 'e') { endTurn(sendJsonMessage) };
    };
    useKeyPress(['e'], onKeyPress);

    const banner_height = bar_height * 0.9;
    const banner_width = banner_height * 0.8;

    return (
        <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
            { (active_player_id !== undefined && active_player_id === 1 && current_state === 'PLAYING') ?
                <Box sx={{ width: banner_width, height: banner_height }} /> :
                <Stack alignItems={'center'} justifyContent={'center'}>
                    { active_player_id !== undefined && current_state === 'PLAYING' && 
                    <img
                        alt={'left'}
                        src={LeftArrow}
                        width={bar_height * 0.85}
                        height={bar_height * 0.85}
                    /> }
                </Stack> 
            }

            <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                { current_state === 'PLACING' ?
                <Stack alignItems={'center'} justifyContent={'center'}>
                    { this_player_ready ? <WaitingDots /> :
                    <Button variant={'contained'} size={bar_height < 80 ? 'small' : 'medium'} sx={{ maxHeight: bar_height * 0.85 }} onClick={() => { endTurn(sendJsonMessage) }} disabled={this_player_ready}>
                        Place Pieces
                    </Button> }
                </Stack> :
                <Stack alignItems={'center'} justifyContent={'center'}>
                    <Button variant={'contained'} size={bar_height < 80 ? 'small' : 'medium'} sx={{ maxHeight: bar_height * 0.85 }} onClick={() => { endTurn(sendJsonMessage) }} disabled={(this_player_id !== active_player_id)}>
                        End Turn
                    </Button>
                </Stack> }
            </Stack>

            { (active_player_id !== undefined && active_player_id === 0 && current_state === 'PLAYING') ?
                <Box sx={{ width: banner_width, height: banner_height }} /> :
                <Stack alignItems={'center'} justifyContent={'center'}>
                    { active_player_id !== undefined && current_state === 'PLAYING' && 
                    <img
                        alt={'right'}
                        src={RightArrow}
                        width={bar_height * 0.85}
                        height={bar_height * 0.85}
                    /> }
                </Stack> 
            }
        </Stack>
    );
}