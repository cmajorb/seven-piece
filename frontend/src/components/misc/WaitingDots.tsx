import { keyframes, Stack } from '@mui/material';
import { EDGE_COLOR, MIDDLE_COLOR } from '../../utils/defaultColors';

// ----------------------------------------------------------------------

export default function WaitingDots() {

    const side_dots = (
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
    const middle_dot = (
        keyframes`
        0% {
            padding-left: 2%;
            padding-right: 2%;
            opacity: 35%;
            scale: 1.2;
        }
        100% {
            padding-left: 0%;
            padding-right: 0%;
            opacity: 100%;
            scale: 1;
        }`
    );       

    return (
        <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${side_dots} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${middle_dot} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${side_dots} 1s infinite linear alternate` }}>
                <div style={{ background: `linear-gradient(45deg, #${EDGE_COLOR} 30%, #${MIDDLE_COLOR} 80%)`, borderRadius: '50%', width: '10px', height: '10px' }}/>
            </Stack>
        </Stack>
    );
};