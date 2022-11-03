import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from './routes/paths';
// @mui
import { Stack, Button, Paper, Typography, TextField, useTheme } from '@mui/material';
import getValidUUID from '../utils/getValidUUID';
import useKeyPress from '../utils/useKeyPress';
import BackgroundImage from '../images/login_background.jpeg';
import typography from '../theme/typography';

export default function StartGame() {
    const navigate = useNavigate();

    const theme = useTheme();
    const path_str = "menu";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://' + process.env.REACT_APP_DJANGO_URL + path_str, {share: true});
    const default_map = 5;

    const [gameID, setGameID] = useState<string>('');
    const [canJoinGame, setCanJoinGame] = useState<boolean>(false);

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

    useEffect(() => { setCanJoinGame(checkGameID(gameID)) }, [gameID])

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Stack spacing={3} alignItems={'center'}>
                <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                    <Typography
                        fontSize={typography.h1.fontSize}
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                    >
                        Blood
                    </Typography>
                    <Typography
                        fontSize={typography.h4.fontSize}
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                        sx={{ pl: 0.5 }}
                    >
                        for
                    </Typography>
                    <Typography
                        fontSize={typography.h1.fontSize}
                        fontWeight={'bold'}
                        fontFamily={'fantasy'}
                        color={theme.palette.grey[400]}
                    >
                        Glory
                    </Typography>
                </Stack>
                <Stack direction={'row'} spacing={1} width={'50vw'}>
                    <Button
                        variant='contained'
                        fullWidth
                        disabled={!canJoinGame}
                        sx={{
                            fontFamily: 'fantasy',
                            fontWeight: 'bold',
                            "&:disabled": {
                                backgroundColor: theme.palette.grey[800],
                                opacity: 0.5
                            }
                        }}
                        onClick={() => { sendJsonMessage({ type: "create_game", map: default_map.toString() }) }}
                    >
                        Create Game
                    </Button>
                    <Button
                        variant='contained'
                        fullWidth
                        disabled={!canJoinGame}
                        sx={{
                            fontFamily: 'fantasy',
                            fontWeight: 'bold',
                            "&:disabled": {
                                backgroundColor: theme.palette.grey[800],
                                opacity: 0.5
                            }
                        }}
                        onClick={() => { sendJsonMessage({ type: "simulate" }) }}
                    >
                        Simulate Game
                    </Button>
                </Stack>
                <TextField
                    label="Game ID"
                    sx={{ width: '50vw' }}
                    InputLabelProps={{ style: { fontFamily: 'fantasy', fontWeight: 'bold' } }}
                    inputProps={{ style: { fontFamily: 'fantasy', fontWeight: 'bold', textAlign: 'center' } }}
                    InputProps={{ style: { backgroundColor: theme.palette.grey[800], opacity: 0.5 } }}
                    value={gameID}
                    onChange={handleChangeGameID}
                />
                <Button
                    variant='contained'
                    sx={{
                        width: '50vw',
                        fontFamily: 'fantasy',
                        fontWeight: 'bold',
                        "&:disabled": {
                            backgroundColor: theme.palette.grey[800],
                            opacity: 0.5
                        }
                    }}
                    disabled={canJoinGame}
                    onClick={() => { navigate(PATH_DASHBOARD.general.board + gameID) }}
                >
                    Join Game
                </Button>                
            </Stack>
        </Paper>
    );
};