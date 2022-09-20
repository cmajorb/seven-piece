import { Stack, Divider } from '@mui/material';
import { keyframes } from '@mui/system';

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
    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            { is_turn ?
            <Divider variant="middle" color={bg_color} sx={{ margin: '0 20px', borderRadius: '10px', height: 4, animation: `${line_grow} 2s forwards ease-in-out` }}/> :
            <Divider variant="middle" color={bg_color} sx={{ margin: '0 20px', borderRadius: '10px', borderColor: bg_color, height: 4, animation: `${line_fade} 2s forwards ease-in-out` }}/> }

        </Stack>
    );
}