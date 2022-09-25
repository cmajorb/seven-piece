import { Stack, Divider, useTheme, Paper } from '@mui/material';
import Cell from './Cell';
import PieceDetails from './PieceDetails';
import { useState, useEffect } from 'react';
import { Piece, Map, PieceActions } from '../types';
import calcSelectedTile from '../utils/calcSelectedTile';
import checkSameLocation from '../utils/checkSameLocation';
import getCellStatus from '../utils/getCellStatus';
import PieceBottomBar from './PieceBottomBar';

// ----------------------------------------------------------------------

type Props = {
    rows: number,
    columns: number,
    pieces: Piece[],
    map: Map,
    active_player_id: number | undefined,
    this_player_id: number,
    objectives: string[],
    game_state: string,
    submitPieceAction: any
};

// ----------------------------------------------------------------------

export default function MainGrid({ rows, columns, pieces, map, active_player_id, objectives, this_player_id, game_state, submitPieceAction }: Props) {
    
    const theme = useTheme();
    const active_turn: boolean = (active_player_id && active_player_id === this_player_id) ? true : false;

    const display_show_bar: boolean = ((game_state === ('PLACING') || game_state === ('READY') || game_state === ('WAITING')) ? false : true);

    const column_nums = (Array.from(Array(columns).keys()));
    const row_nums = (Array.from(Array(rows).keys())).sort((a, b) => b - a);
    const [selectedTile, setSelectedTile] = useState<number[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();
    const [actionType, setActionType] = useState<PieceActions>('move');
    useEffect(() => { setSelectedTile([]); setSelectedPiece(undefined) }, [active_turn]);
    useEffect(() => {}, [selectedTile]);
    useEffect(() => { if (selectedPiece) { console.log("Currently Selected Piece:", selectedPiece) } }, [selectedPiece]);

    const updateSelected = (location: number[], piece: Piece | undefined, checking: boolean) => {
        const same_location = checkSameLocation(location, selectedTile);
        if (same_location) { setSelectedTile([]); setSelectedPiece(undefined) }
        else {
            if (selectedPiece && !checking) { submitPieceAction(selectedPiece.id, location, actionType) };
            setSelectedTile(location);
            if (piece && piece.player === this_player_id) { setSelectedPiece(piece) }
            else if (piece && piece.player !== this_player_id) { console.log("CLICKED ON ANOTHER PIECE") }
            else { setSelectedPiece(undefined) };
        }
    }

    const handleActionType = (action_type: PieceActions) => { setActionType(action_type) };

    return (
        <>
            <Stack spacing={2}>
                <Stack direction={'row'} spacing={2} alignContent={'center'} justifyContent={'space-around'}>
                    <Paper
                        sx={{ p: 1, backgroundImage: `url("https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png")` }}
                        elevation={2}
                        onContextMenu={(e)=> e.preventDefault()}
                        onMouseDown={(e)=> e.preventDefault()}
                    >
                        <Stack spacing={0.25} direction={'row'}>
                            {column_nums.map((column) => (
                                <Stack key={column} spacing={0.25} direction={'column'}>
                                    {row_nums.map((row) => (
                                        <Cell key={([row, column]).toString()}
                                            location={[row, column]}
                                            selected={calcSelectedTile(selectedTile, [row, column])}
                                            cell_status={getCellStatus(objectives, map.data, [row, column])}
                                            pieces={pieces}
                                            color_scheme={map.color_scheme}
                                            this_player_id={this_player_id}
                                            updateSelected={updateSelected}
                                        />
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>
                    <Divider orientation="vertical" flexItem color={theme.palette.common.black} />
                    <PieceDetails
                        selected_piece={selectedPiece}
                        selected_action={actionType}
                        this_player_id={this_player_id}
                        active_turn={active_turn}
                        handleActionType={handleActionType}
                    />
                </Stack>
            </Stack>
            { pieces && (this_player_id !== undefined) && display_show_bar &&
                <PieceBottomBar
                    pieces={pieces}
                    selected_tile={selectedTile}
                    selected_action={actionType}
                    this_player_id={this_player_id}
                    color_scheme={map.color_scheme}
                    active_player_id={active_player_id}
                    updateSelected={updateSelected}
                    handleActionType={handleActionType}
                />
            }
        </>
    );
}