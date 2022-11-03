import Sound from 'react-sound';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme, Stack, keyframes, Button, Typography } from '@mui/material';
import Logo from '../Logo';
import { PATH_DASHBOARD } from '../../pages/routes/paths';
import { WaitingLine } from './DynamicLines';
import AndrewTest from '../music/AndrewTest.mp3';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const animation = (
    keyframes`
    0% {
        opacity: 35%;
        scale: 1.5;
        transform: rotateY(0deg);
    }
    100% {
        opacity: 100%;
        scale: 1;
        transform: rotateY(360deg);
    }`
);

type Props = {
    wait_time: number,
    bg_color: string,
    middle_color: string,
    edge_color: string,
};

export default function WaitingScreen({ wait_time, bg_color, middle_color, edge_color }: Props) {
    
    const navigate = useNavigate();
    const theme = useTheme();

    const [musicPlaying, setMusicPlaying] = useState<boolean>(true);
    function resetMusic() { if (!musicPlaying) { setMusicPlaying(true) }; if (musicPlaying) { setMusicPlaying(false) } };

    useEffect(() => {}, [musicPlaying]);

    useEffect(() => { 
        let prefs = localStorage.getItem('musicPref');
        if (prefs === 'false') { setMusicPlaying(false) }
        else if (prefs === 'true') { setMusicPlaying(true) }
        else { setMusicPlaying(true); localStorage.setItem('musicPref', 'true') };
    }, []);

    return (
        <>
            <Sound
                url={AndrewTest}
                playFromPosition={0}
                playStatus={musicPlaying ? 'PLAYING' : 'STOPPED'}
                onFinishedPlaying={resetMusic}
            />
            <Stack spacing={6} sx={{ height: '100vh', justifyContent: 'space-around' }}>
                <Stack spacing={4}>
                    <Typography fontFamily={'fantasy'} fontWeight={'bold'} color={theme.palette.grey[400]} variant='h5'>Looking for Opponent...</Typography>
                    <WaitingLine wait_time={wait_time} bg_color={bg_color} middle_color={middle_color} edge_color={edge_color} />
                </Stack>
                <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `${animation} 2s infinite linear alternate` }}>
                    <Logo disabledLink />
                    <Box
                        sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '25%',
                        position: 'absolute',
                        border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.5)}`,
                        }}
                    />

                    <Box
                        sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '25%',
                        position: 'absolute',
                        border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.5)}`,
                        }}
                    />
                </Stack>
                <Button
                    variant='contained'
                    fullWidth
                    sx={{ fontFamily: 'fantasy', fontWeight: 'bold' }}
                    onClick={() => { navigate(PATH_DASHBOARD.general.start) }}
                >
                    Cancel
                </Button>
            </Stack>
        </>
    );
}
