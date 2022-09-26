import { Grid, useTheme, Stack, Card } from '@mui/material';
import { ColorScheme, Piece, PieceActions, Stats } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import checkSameLocation from '../utils/checkSameLocation';
import { BottomBarImgs, PieceImg } from './PNGImages';

// ----------------------------------------------------------------------

type Props = {
    piece: Piece,
    selected_tile: number[],
    selected_action: PieceActions,
    this_player_id: number,
    color_scheme: ColorScheme,
    updateSelected: any,
    handleActionType: any,
  };

// ----------------------------------------------------------------------

export default function PieceStatStack({ piece, selected_tile, selected_action, this_player_id, color_scheme, updateSelected, handleActionType }: Props) {

    const theme = useTheme();
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };
  
    return (
      <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
  
        <Card
          sx={{
            pt: 0.1, pb: 1.75, pr: 0.75, pl: 2,
            backgroundColor: theme.palette.common.black,
            border: 2,
            '&:hover': { cursor: 'pointer' },
            ...((checkSameLocation(piece.location, selected_tile)) && { borderColor: (GetBorderColor(color_scheme, this_player_id, true)) }),
            ...(piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
          }}
          onClick={() => { updateSelected(piece.location, piece, true) }}
        >
          <Grid container direction={'row'} spacing={2} justifyContent={'flex-start'} alignItems={'center'}>
            <Grid item>
              <PieceImg
                key={piece.id + piece.character + piece.player}
                player_id={piece.player}
                piece_name={piece.character}
                health={0}
                on_board={true}
                height={100}
                width={100}
              />
            </Grid>
            <Grid item>
              <Stack spacing={0.5} sx={{ pt: 1.5 }}>
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
            </Grid>
          </Grid>
        </Card>
      </Stack>
    );
  }