import { Stack, Divider } from '@mui/material';
import { keyframes } from '@mui/system';
import LineBackground from '../images/platinum_texture.jpeg';

// ----------------------------------------------------------------------

type TurnLineProps = {
    is_turn: boolean,
    bg_color: string,
};

// ----------------------------------------------------------------------

const line_grow = (
    keyframes`
    from {
        width: 0%;
    }
    to {
        width:100%;
    }`
);

const line_fade = (
    keyframes`
    from {
        width: 100%;
    }
    to {
        width:0%;
    }`
);

export function TurnLine({ is_turn, bg_color }: TurnLineProps) {

    const background_img: string = 'linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, #69ACEF 75%, #3064F2 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, #69ACEF 75%, #3064F2 100%)';

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            { is_turn ?            
            <Divider
                variant="middle"
                sx={{ margin: '0 20px', borderRadius: '10px', height: 8, animation: `${line_grow} 2s forwards ease-in-out`, backgroundImage: background_img }}
            /> :
            <Divider
                variant="middle"
                sx={{ margin: '0 20px', borderRadius: '10px', height: 8, animation: `${line_fade} 2s forwards ease-in-out`, backgroundImage: background_img }}
            /> }
        </Stack>
    );
}