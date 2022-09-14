import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from './routes/paths';
// @mui
import { Stack, Button, Container, TextField } from '@mui/material';

export default function StartGame() {
    const navigate = useNavigate();

    const path_str = "game/none";
    const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1/' + path_str)

    const [gameID, setGameID] = useState<string>('');
    const handleChangeGameID = (event: any) => {
        setGameID(event.target.value);
    };

    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log("LAST MESSAGE", lastJsonMessage);
            const message_str = JSON.stringify(lastJsonMessage);
            const message = JSON.parse(message_str);
            switch (message.type) {
                case 'game_state':
                const game_state = JSON.parse(message.state);
                navigate(PATH_DASHBOARD.general.board + game_state.session);
                break;
                case 'error':
                console.log(message.message);
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
            <Stack spacing={2}>
                <Button variant='contained'
                    onClick={() => { sendJsonMessage({ type: "create_game", map: "1" }) }}
                >Create Game</Button>
                <Button variant='contained'
                    onClick={() => {
                        sendJsonMessage({ type: "join_game", session: gameID });
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