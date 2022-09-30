import { useState, useEffect } from 'react';
import { Piece, Map } from '../types';
import { Paper, Stack } from '@mui/material';
import { TurnLine } from '../components/misc/DynamicLines';

// ----------------------------------------------------------------------

type Props = {
    all_pieces: Piece[],
    map: Map,
    this_player_id: number,
    setPieces: any,
    endTurn: any,
};

// ----------------------------------------------------------------------

export default function SelectPieces({ all_pieces, map, this_player_id, setPieces, endTurn }: Props) {

    const [selectedTeam, setSelectedTeam] = useState<Piece[]>();
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();

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
            <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                {/* <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <TurnLine
                        is_turn={thisPlayer.is_turn}
                        bg_color={'FAF7EB'}
                        middle_color={'F0DA81'}
                        edge_color={'A08519'}
                        turn_seconds={100}
                    />
                </Stack>
                { gameState && (thisPlayer !== undefined) &&
                <SelectBBar
                    selected_pieces={gameState.pieces}
                    score_to_win={gameState.score_to_win}
                    endTurn={endTurn}
                    setPieces={setPieces}
                />
                } */}
            </Stack>
        </Paper>
    );
};