import { Stack, Divider, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import calcHexToRGB from '../../utils/calcHexToRGB';
import getWindowDimensions from '../../utils/useWindowDimensions';

// ----------------------------------------------------------------------

type TurnLineProps = {
    start_position: number,
    is_turn: boolean,
    bg_color: string,
    middle_color: string,
    edge_color: string,
    turn_seconds: number,
};

type WaitingLineProps = {
    wait_time: number,
    bg_color: string,
    middle_color: string,
    edge_color: string,
};

// ----------------------------------------------------------------------

export function WaitingLine({ wait_time, bg_color, middle_color, edge_color }: WaitingLineProps) {
    
    const theme = useTheme();
    const bg_rgb = calcHexToRGB(bg_color, 0);
    const background_img: string = `linear-gradient(1turn, rgba(255, 255, 255, 0) 0%, ${bg_rgb} 35%, #${middle_color} 75%, #${edge_color} 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, ${bg_rgb} 35%, #${middle_color} 75%, #${edge_color} 100%)`;
    
    const wait_animation = (
        keyframes`
        from {
            width: 60%;
        }
        to {
            width: 0%;
        }`
    );

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <Divider
                sx={{
                    position: 'absolute',
                    borderRadius: '10px',
                    height: 20,
                    width: '60%',
                    animation: `${wait_animation} ${wait_time}s forwards linear`, backgroundImage: background_img
                }}
            />                
            <Divider
                sx={{
                    position: 'absolute',
                    borderRadius: '10px',
                    height: 20,
                    width: '60%',
                    border: 2,
                    borderColor: theme.palette.grey[700],
                }}
            />
        </Stack>
    );
};

export function TurnLine({ start_position, is_turn, bg_color, middle_color, edge_color, turn_seconds }: TurnLineProps) {

    const { height } = getWindowDimensions();
    const line_height = (height / 1.75);

    const line_grow = (
        keyframes`
        from {
            height: 0px;
        }
        to {
            height: ${line_height}px;
        }`
    );
    
    const line_fade = (
        keyframes`
        from {
            height: ${line_height}px;
        }
        to {
            height: 0px;
        }`
    );

    const theme = useTheme();
    const bg_rgb = calcHexToRGB(bg_color, 0);
    const background_img: string = `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${bg_rgb} 35%, #${middle_color} 75%, #${edge_color} 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, ${bg_rgb} 35%, #${middle_color} 75%, #${edge_color} 100%)`;

    return (
        <Stack justifyContent={'center'} alignItems={'flex-start'} sx={{ position: 'fixed', top: start_position, left: 0, pl: 1.5 }}>
            <Stack justifyContent={'center'} alignItems={'center'}>
                <Divider
                    orientation="vertical"
                    sx={{
                        position: 'absolute',
                        borderRadius: '10px',
                        maxHeight: line_height,
                        width: 15,
                        animation: `${is_turn ? line_fade : line_grow} ${is_turn ? turn_seconds : 1}s forwards linear`, backgroundImage: background_img
                    }}
                />                
                <Divider
                    orientation="vertical"
                    sx={{
                        position: 'fixed',
                        border: 2,
                        borderColor: theme.palette.grey[700],
                        width: 15,
                        borderRadius: '10px',
                        height: line_height,
                    }}
                />
            </Stack>
        </Stack>
    );
}