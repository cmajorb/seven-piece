import { useTheme, Stack, Card, CardActionArea, CardActions } from '@mui/material';
import { ColorScheme, Piece, PieceActions, Stats } from '../../types';
import GetBorderColor from '../../utils/getBorderColor';
import checkSameLocation from '../../utils/checkSameLocation';
import { BottomBarImgs, PieceImg } from '../misc/PNGImages';
import MiniActionSelect from './MiniActionSelect';

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

export default function PieceStatStack({ piece, selected_tile, selected_action, this_player_id, color_scheme, updateSelected, setActionType }: Props) {

    const theme = useTheme();
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };
    const default_border_color = theme.palette.grey[700];

    return (
      <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>       
        <Card
          sx={{
            pt: 0.25, pb: 0.25, pr: 0.75, pl: 0.25,
            backgroundColor: theme.palette.common.black,
            border: 2,
            borderColor: default_border_color,
            '&:hover': { cursor: 'pointer' },
            ...((checkSameLocation(piece.location, selected_tile)) && { borderColor: (GetBorderColor(color_scheme, this_player_id, true)) }),
            ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
          }}
        >
            <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                <CardActions sx={{ p: 0 }}>
                    <MiniActionSelect
                        piece={piece}
                        selected_tile={selected_tile}
                        selected_action={selected_action}
                        this_player_id={this_player_id}
                        color_scheme={color_scheme}
                        updateSelected={updateSelected}
                        setActionType={setActionType}
                    />                    
                </CardActions>
                <CardActionArea onClick={() => { updateSelected(piece.location, piece, true) }}>
                    <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                        <Stack sx={{ pl: 1, pb: 1.5, pr: 0.5 }}>
                            <PieceImg
                                key={piece.id + piece.character + piece.player}
                                player_id={piece.player}
                                piece_name={piece.character}
                                health={0}
                                on_board={true}
                                height={100}
                                width={100}
                            />
                        </Stack>
                        <Stack spacing={0.5}>
                            {stat_types.map((stat, index) => (
                            <BottomBarImgs
                                key={piece.id + piece.character + stat + piece.player}
                                type={stat}
                                current_stat={piece.current_stats[getStatType(index) as keyof Stats]}
                                max_stat={piece.start_stats[getStatType(index) as keyof Stats]}
                                height={20}
                                width={20}
                            />            
                            ))}
                        </Stack>
                    </Stack>
                </CardActionArea>
            </Stack>
        </Card>
      </Stack>
    );
  }