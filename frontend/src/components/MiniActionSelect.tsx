import { useTheme, Stack, Box } from '@mui/material';
import { ColorScheme, Piece, PieceActions, Stats } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import checkSameLocation from '../utils/checkSameLocation';
import { BottomBarImgs } from './PNGImages';
import useKeyPress from '../utils/useKeyPress';

// ----------------------------------------------------------------------

type Props = {
    piece: Piece,
    selected_tile: number[],
    selected_action: PieceActions,
    this_player_id: number,
    color_scheme: ColorScheme,
    updateSelected: any,
    setActionType: any,
  };

// ----------------------------------------------------------------------

export default function MiniActionSelect({ piece, selected_tile, selected_action, this_player_id, color_scheme, setActionType }: Props) {

    const theme = useTheme();
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };
    const default_border_color = theme.palette.grey[700];
  
    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === '1') { setActionType('move') };
        if (key === '2') { setActionType('attack') };
    };
    useKeyPress(['1', '2'], onKeyPress);

    return (
        <Stack spacing={0.2}>
            <Box
                sx={{
                    p: 0.5,
                    border: 2,
                    borderColor: default_border_color,
                    borderRadius: '5px',
                    '&:hover': { cursor: 'pointer' },
                    ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === 'move') && (piece.player === this_player_id) && {
                        borderColor: (GetBorderColor(color_scheme, this_player_id, true))
                    }),
                    ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                }}
                onClick={() => { ((piece.player === this_player_id) && setActionType('move')) }}
            >
                <BottomBarImgs
                    type={'speed'}
                    side={'right'}
                    current_stat={piece.current_stats[getStatType(2) as keyof Stats] !== 0 ? 1 : 0}
                    max_stat={1}
                    height={20}
                    width={20}
                />
            </Box>
            <Box
                sx={{
                    p: 0.5,
                    border: 2,
                    borderColor: default_border_color,
                    borderRadius: '5px',
                    '&:hover': { cursor: 'pointer' },
                    ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === 'attack') && (piece.player === this_player_id) && {
                        borderColor: (GetBorderColor(color_scheme, this_player_id, true))
                    }),
                    ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                }}
                onClick={() => { ((piece.player === this_player_id) && setActionType('attack')) }}
            >
                <BottomBarImgs
                    type={'attack'}
                    side={'right'}
                    current_stat={piece.current_stats[getStatType(1) as keyof Stats] !== 0 ? 1 : 0}
                    max_stat={1}
                    height={20}
                    width={20}
                />
            </Box>
            <Box
                sx={{
                    p: 0.5,
                    border: 2,
                    borderColor: default_border_color,
                    borderRadius: '5px',
                    '&:hover': { cursor: 'pointer' },
                    // ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === 'attack') && (piece.player === this_player_id) && {
                    //     borderColor: (GetBorderColor(color_scheme, this_player_id, true))
                    // }),
                    // ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                }}
                onClick={(event: any) => { event.stopPropagation(); event.preventDefault(); }}
            >
                <BottomBarImgs
                    type={'disabled'}
                    side={'right'}
                    current_stat={piece.current_stats[getStatType(1) as keyof Stats] !== 0 ? 1 : 0}
                    max_stat={1}
                    height={20}
                    width={20}
                />
            </Box>
        </Stack>
    );
  }