import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from './routes/paths';
// @mui
import { Stack, Button, Paper, Typography, TextField, useTheme } from '@mui/material';
import getValidUUID from '../utils/getValidUUID';
import useKeyPress from '../utils/useKeyPress';
import BackgroundImage from '../images/login_background.jpeg';

export default function StartGame() {
    const navigate = useNavigate();

    const theme = useTheme();
    const path_str = "menu";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1:8080/' + path_str);
    const default_map = 2;

    const [gameID, setGameID] = useState<string>('');
    const handleChangeGameID = (event: any) => {
        setGameID(event.target.value);
    };

    const checkGameID = (gameID: string | undefined) => {
        if (getValidUUID(gameID)) { return false } else { return true };
    };

    const onKeyPress = (event: any) => {
        const disabled: boolean = checkGameID(gameID);
        if (!disabled && event.key === 'Enter') { navigate(PATH_DASHBOARD.general.board + gameID) };
    };
    useKeyPress(['Enter'], onKeyPress);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const message_str = JSON.stringify(lastJsonMessage);
            const message = JSON.parse(message_str);
            switch (message.type) {
                case 'start_game':
                const session_id = message.session_id;
                navigate(PATH_DASHBOARD.general.board + session_id);
                break;
                case 'error':
                console.log(message.message);
                break;
                case 'get_maps':
                console.log(message.maps);
                break;
                case 'get_simulation':
                navigate(PATH_DASHBOARD.general.board + message.session)
                break;
                default:
                console.error('Unknown message type!');
                break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    return (
        <Paper
            square={true}
            sx={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Stack spacing={2} alignItems={'center'} sx={{ pt: 4 }}>
                <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                    <Typography
                        variant='h2'
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                    >
                        Blood
                    </Typography>
                    <Typography
                        variant='h5'
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                        sx={{ pl: 0.5 }}
                    >
                        for
                    </Typography>
                    <Typography
                        variant='h2'
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                    >
                        Glory
                    </Typography>
                </Stack>
                <Button
                    variant='contained'
                    sx={{ width: 300 }}
                    onClick={() => { sendJsonMessage({ type: "create_game", map: default_map.toString() }) }}
                >
                    Create Game
                </Button>
                <Button
                    variant='contained'
                    sx={{
                        width: 300,
                        "&:disabled": {
                            backgroundColor: theme.palette.grey[800],
                            opacity: 0.85
                        }
                    }}
                    disabled={checkGameID(gameID)}
                    onClick={() => { navigate(PATH_DASHBOARD.general.board + gameID) }}
                >
                    Join Game
                </Button>
                <Button
                    variant='contained'
                    sx={{ width: 300 }}
                    onClick={() => { sendJsonMessage({ type: "simulate" }) }}
                >
                    Simulate Game
                </Button>
                <TextField
                    label="Game ID"
                    sx={{
                        width: 600,
                        backgroundColor: theme.palette.grey[800],
                        opacity: 0.5
                    }}
                    InputLabelProps={{ style: { textAlign: 'center', justifyContent: 'center', alignItems: 'center' } }}
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={gameID}
                    onChange={handleChangeGameID}
                />
            </Stack>
        </Paper>
    );
};