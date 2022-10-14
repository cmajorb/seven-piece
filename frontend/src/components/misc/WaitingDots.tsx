import { keyframes, Stack } from '@mui/material';
import { EDGE_COLOR, MIDDLE_COLOR } from '../../utils/defaultColors';

// ----------------------------------------------------------------------

export default function WaitingDots() {

    const dots_waiting = (
        keyframes`
        0% {
            opacity: 35%;
            scale: 1.2;
        }
        100% {
            opacity: 100%;
            scale: 1;
        }`
    );

    return (
        <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${dots_waiting} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
        </Stack>
    );
};