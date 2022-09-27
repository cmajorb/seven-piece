import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import MainGrid from '../components/MainGrid';
import { GameState, Piece, PieceActions } from '../types';
import getTeamScores from '../utils/getTeamScores';
import { Paper, Stack } from '@mui/material';
import BannerScore from '../components/BannerScore';
import getDisplayTurn from '../utils/getDisplayTurn';
import MainBBar from '../components/MainB-Bar';
import checkSameLocation from '../utils/checkSameLocation';

// ----------------------------------------------------------------------

type Props = {
  setConnectionStatus: any,
  setCurrentState: any,
};

// ----------------------------------------------------------------------

export default function MainBoard ({ setConnectionStatus, setCurrentState }: Props) {

  const [gameState, setGameState] = useState<GameState>();
  const [thisPlayer, setThisPlayer] = useState<number>();
  const [activePlayer, setActivePlayer] = useState<number>();
  const [activeTurn, setActiveTurn] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
  const [actionType, setActionType] = useState<PieceActions>('move');

  const { game_id } = useParams();

  const path_str = "game/" + game_id;
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket('ws://127.0.0.1:8080/' + path_str)

  useEffect(() => {
    console.log("Joining:");
    sendJsonMessage({ type: "join_game", session: game_id });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null) {
        const message_str = JSON.stringify(lastJsonMessage);
        const message = JSON.parse(message_str);
        switch (message.type) {
            case 'game_state':
              const game_state: GameState = JSON.parse(message.state);
              const session: string = message.this_player_session;
              if (thisPlayer === undefined) {
                if (session === game_state.players[0].session) { setThisPlayer(game_state.players[0].number) }
                else if (session === game_state.players[1].session) { setThisPlayer(game_state.players[1].number) }
                else { console.log("DID NOT SET PLAYER") };
              };
              console.log('Set GameState:', game_state);
              setGameState(game_state);
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

  useEffect(() => {
    setCurrentState((gameState ? gameState.state : "None"));
    if ((thisPlayer !== undefined) && gameState && gameState.players[0].is_turn) {
      setActivePlayer(0);
    } else { setActivePlayer(1) };
    if ((thisPlayer !== undefined) && gameState && gameState.players[thisPlayer].is_turn) { setActiveTurn(true) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const setPieces = (piece_array: string) => {
    sendJsonMessage({
      type: "select_pieces",
      pieces: piece_array
    })
  };

  const endTurn = () => {
    setActiveTurn(false);
    sendJsonMessage({
      type: "end_turn",
    })
  };

  const submitPieceAction = (piece_id: number, new_location: number[], action_type: string) => {
    sendJsonMessage({
      type: "action",
      piece: piece_id,
      location_x: new_location[0],
      location_y: new_location[1],
      action_type: action_type
    })
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setConnectionStatus(connectionStatus) }, [connectionStatus]);
  useEffect(() => { setSelectedTile([]); setSelectedPiece(undefined) }, [activeTurn]);
  useEffect(() => {}, [selectedTile]);
  useEffect(() => { setActionType('move') }, [selectedPiece]);

  const updateSelected = (location: number[], piece: Piece | undefined, checking: boolean) => {
    const same_location = checkSameLocation(location, selectedTile);
    if (same_location) { setSelectedTile([]); setSelectedPiece(undefined) }
    else {
        if (selectedPiece && !checking) { submitPieceAction(selectedPiece.id, location, actionType) };
        setSelectedTile(location);
        if (piece && piece.player === thisPlayer) { setSelectedPiece(piece) }
        else if (piece && piece.player !== thisPlayer) { console.log("CLICKED ON ANOTHER PIECE") }
        else { setSelectedPiece(undefined) };
    }
  }

  return (
    <Paper square elevation={0} onContextMenu={(e)=> e.preventDefault()} onMouseDown={(e)=> e.preventDefault()}
      sx={{
        p: 1,
        backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '120vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
        { gameState && (thisPlayer !== undefined) &&
        <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            { getDisplayTurn(gameState.state, gameState.turn_count) >= 0 &&
              <BannerScore
                team_scores={getTeamScores(gameState.players)}
                total_objectives={(gameState.objectives).length}
                score_to_win={gameState.score_to_win}
                is_turn={activeTurn}
              />
            }
            <MainGrid
              pieces={gameState.pieces}
              map={gameState.map}
              objectives={gameState.objectives}
              this_player_id={thisPlayer}
              selected_tile={selectedTile}
              updateSelected={updateSelected}
            />
          </Stack>
          { gameState && (thisPlayer !== undefined) &&
            <MainBBar
              pieces={gameState.pieces}
              selected_tile={selectedTile}
              selected_action={actionType}
              this_player_id={thisPlayer}
              active_player_id={activePlayer}
              color_scheme={gameState.map.color_scheme}
              current_state={gameState.state}
              setActionType={setActionType}
              updateSelected={updateSelected}
              endTurn={endTurn}
              setPieces={setPieces}
            />
          }
        </Stack>
        }
    </Paper>
  );
};