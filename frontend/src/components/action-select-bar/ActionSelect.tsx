import { useTheme, Stack, Box } from '@mui/material';
import { ColorScheme, GameStatus, Piece, PieceActions, Player, SpecialAbility, Stats } from '../../types';
import GetBorderColor from '../../utils/getBorderColor';
import checkSameLocation from '../../utils/checkSameLocation';
import { BottomBarImgs } from '../misc/PNGImages';
import useKeyPress from '../../utils/useKeyPress';
import getPiece from '../../utils/getPiece';
import PieceDetails from './PieceDetails';
import getSpecialAbility from '../../utils/getSpecialAbility';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

type Props = {
    piece?: Piece,
    start_position: number,
    all_pieces: Piece[] | undefined,
    selected_tile: number[],
    selected_action: PieceActions,
    this_player: Player,
    color_scheme: ColorScheme,
    all_specials: SpecialAbility[] | undefined,
    current_state: GameStatus,
    infoOpen: boolean,
    setActionType: any,
    handleInfoToggle: any,
  };

// ----------------------------------------------------------------------

export default function ActionSelect({ piece, start_position, all_pieces, selected_tile, selected_action, this_player, color_scheme, all_specials, current_state, infoOpen, setActionType, handleInfoToggle }: Props) {

    const theme = useTheme();
    const stat_types: string[] = ['health', 'attack', 'speed', 'special'];
    const getStatType = (index: number) => { return stat_types[index] };
    const default_border_color = theme.palette.grey[700];
    const image_height = 40;
    const image_width = 40;



    const observed_piece: Piece | undefined = getPiece(selected_tile, all_pieces);
  
    const special_ability: string | undefined = getSpecialAbility(piece, all_specials);
    const onKeyPress = (event: any) => {
        const key: string = ((event.key).toString());
        if (key === '1') { setActionType('move') };
        if (key === '2') { setActionType('attack') };
        if (key === '3' && special_ability) { setActionType(special_ability) };
    };
    useKeyPress(['1', '2', '3'], onKeyPress);

    useEffect(() => {}, [infoOpen]);

    return (
        <Stack spacing={3} sx={{ position: 'fixed', top: start_position, right: 10, pr: 0.5 }}>
            { observed_piece ?
            <Box
                sx={{
                    p: 0.5,
                    border: 2,
                    borderColor: default_border_color,
                    borderRadius: '5px',
                    '&:hover': { cursor: 'pointer' },
                }}
            >
                <PieceDetails observed_piece={observed_piece} width={image_width} height={image_height} infoOpen={infoOpen} handleInfoToggle={handleInfoToggle} />
            </Box> :
            <Box sx={{ p: 0.5, border: 2, borderColor: default_border_color, borderRadius: '5px', '&:hover': { cursor: 'pointer' } }}>
                <BottomBarImgs
                    type={'disabled'}
                    current_stat={0}
                    max_stat={1}
                    height={image_height}
                    width={image_width}
                />
            </Box>            
            }
            { (piece && current_state !== 'PLACING') ?
            <Stack spacing={0.3}>
                <Box
                    sx={{
                        p: 0.5,
                        border: 2,
                        borderColor: default_border_color,
                        borderRadius: '5px',
                        '&:hover': { cursor: 'pointer' },
                        ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === 'move') && (piece.player === this_player.number) && {
                            borderColor: (GetBorderColor(color_scheme, this_player.number, true))
                        }),
                        ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                    }}
                    onClick={() => { ((piece.player === this_player.number) && setActionType('move')) }}
                >
                    <BottomBarImgs
                        type={'speed'}
                        current_stat={piece.current_stats[getStatType(2) as keyof Stats] !== 0 ? 1 : 0}
                        max_stat={1}
                        height={image_height}
                        width={image_width}
                    />
                </Box>
                <Box
                    sx={{
                        p: 0.5,
                        border: 2,
                        borderColor: default_border_color,
                        borderRadius: '5px',
                        '&:hover': { cursor: 'pointer' },
                        ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === 'attack') && (piece.player === this_player.number) && {
                            borderColor: (GetBorderColor(color_scheme, this_player.number, true))
                        }),
                        ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                    }}
                    onClick={() => { ((piece.player === this_player.number && piece.start_stats['attack'] > 0) && setActionType('attack')) }}
                >
                    <BottomBarImgs
                        type={
                            piece.default_stats.attack_range_max > 1 ? 'range' :
                            (piece.default_stats.attack > 0 ? 'melee' : 'disabled')
                        }
                        current_stat={piece.current_stats[getStatType(1) as keyof Stats] !== 0 ? 1 : 0}
                        max_stat={1}
                        height={image_height}
                        width={image_width}
                    />
                </Box>
                <Box
                    sx={{
                        p: 0.5,
                        border: 2,
                        borderColor: default_border_color,
                        borderRadius: '5px',
                        '&:hover': { cursor: 'pointer' },
                        ...((checkSameLocation(piece.location, selected_tile)) && (selected_action === special_ability) && (piece.player === this_player.number) && {
                            borderColor: (GetBorderColor(color_scheme, this_player.number, true))
                        }),
                        ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
                    }}
                    onClick={() => { ((piece.player === this_player.number && special_ability) && setActionType(special_ability)) }}
                >
                    <BottomBarImgs
                        type={special_ability ? special_ability : 'disabled' }
                        current_stat={piece.current_stats[getStatType(3) as keyof Stats] !== 0 ? 1 : 0}
                        max_stat={1}
                        height={image_height}
                        width={image_width}
                    />
                </Box>
            </Stack> :
            <Stack spacing={0.3}>
                {[0, 1, 2].map((index) => (
                <Box
                    key={index}
                    sx={{ p: 0.5, border: 2, borderColor: default_border_color, borderRadius: '5px', '&:hover': { cursor: 'pointer' } }}
                >
                <BottomBarImgs
                    type={'disabled'}
                    current_stat={0}
                    max_stat={1}
                    height={image_height}
                    width={image_width}
                />
                </Box>
                ))}
            </Stack> }
        </Stack>
    );
  }