import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from './routes/paths';
// @mui
import { Stack, Button, Container, Typography, TextField } from '@mui/material';
import getValidUUID from '../utils/getValidUUID';
import useKeyPress from '../utils/useKeyPress';

export default function StartGame() {
    const navigate = useNavigate();

    const path_str = "menu";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1:8080/' + path_str)

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
                default:
                console.error('Unknown message type!');
                break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastJsonMessage]);

    return (
        <Container>
            <Stack spacing={2} alignItems={'center'}>
                <Stack alignItems={'center'}>
                    <Typography variant='h6'>Keep up the good work, guys!</Typography>
                    <Typography variant='h6' fontWeight={'bold'}>BUILD ME!!</Typography>
                </Stack>
                <Button variant='contained' sx={{ width: 300 }}
                    onClick={() => { sendJsonMessage({ type: "create_game", map: "2" }) }}
                >Create Game</Button>
                <Button variant='contained' sx={{ width: 300 }} disabled={checkGameID(gameID)}
                    onClick={() => {
                        navigate(PATH_DASHBOARD.general.board + gameID)
                    }}
                >Join Game</Button>
                <TextField
                    id="game-id"
                    label="Game ID"
                    fullWidth
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={gameID}
                    onChange={handleChangeGameID}
                />
            </Stack>
        </Container>
    );
};