import { useTheme, Stack, Card } from '@mui/material';
import { ColorScheme, Piece, Stats } from '../../types';
import GetBorderColor from '../../utils/getBorderColor';
import checkSameLocation from '../../utils/checkSameLocation';
import { BottomBarImgs, PieceImg } from '../misc/PNGImages';

// ----------------------------------------------------------------------

type Props = {
    this_piece: Piece,
    selected_piece: Piece | undefined,
    selected_tile: number[],
    this_player_id: number,
    color_scheme: ColorScheme,
    updateSelected: any,
  };

// ----------------------------------------------------------------------

export default function PieceStatStack({ this_piece, selected_piece, selected_tile, this_player_id, color_scheme, updateSelected }: Props) {

    const theme = useTheme();
    const stat_types: string[] = ['health', 'attack', 'speed'];
    const getStatType = (index: number) => { return stat_types[index] };
    const default_border_color = theme.palette.grey[900];

    return (
      <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>       
        <Card
          sx={{
            pt: 0.25, pb: 0.25, pr: 0.75, pl: 1.5,
            background: `rgba(0, 0, 0, 0.6) url("https://img.freepik.com/free-photo/metallic-textured-background_53876-89540.jpg?w=1480&t=st=1664334488~exp=1664335088~hmac=d736d5e5e231f4c3de626d7dabe6759613ea143055e0e689c192aa95e3bfdc1f")`,
            backgroundBlendMode: 'darken',
            backgroundPosition: 'bottom',
            backgroundSize: '100%',
            border: 2,
            borderColor: default_border_color,
            // transition: '1s',
            '&:hover': { cursor: 'pointer' },
            ...((checkSameLocation(this_piece.location, selected_tile)) && {
              borderColor: (GetBorderColor(color_scheme, this_player_id, true))
            }),
            // ...((this_piece === selected_piece) && {
            //   boxShadow: `0px 0px 70px 10px ${(GetBorderColor(color_scheme, this_player_id, true))}`,
            //   borderColor: default_border_color
            // }),
            ...(this_piece.current_stats.health <= 0 && { filter: 'grayscale(100%)' })
          }}
          onClick={() => { updateSelected(this_piece.location, this_piece, true) }}
        >
          <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
              <Stack sx={{ pl: 1, pb: 1.5, pr: 0.5 }}>
                <PieceImg
                  key={this_piece.id + this_piece.name + this_piece.player}
                  player_id={this_piece.player}
                  piece_name={this_piece.name}
                  health={0}
                  on_board={true}
                  height={100}
                  width={100}
                />
              </Stack>
              <Stack spacing={0.5}>
                {stat_types.map((stat, index) => (
                <BottomBarImgs
                  key={this_piece.id + this_piece.name + stat + this_piece.player + index}
                  type={stat}
                  current_stat={this_piece.current_stats[getStatType(index) as keyof Stats] as number}
                  max_stat={this_piece.start_stats[getStatType(index) as keyof Stats] as number}
                  height={20}
                  width={20}
                />
                ))}
              </Stack>
            </Stack>
          </Stack>  
        </Card>
      </Stack>
    );
  }