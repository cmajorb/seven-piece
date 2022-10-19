import { AppBar, Box, Toolbar, useTheme, Stack } from '@mui/material';
import { ColorScheme, GameStatus, Piece, Player, Score } from '../../types';
import BBarActionArea from './B-BarActionArea';
import calcHexToRGB from '../../utils/calcHexToRGB';
import BannerScore from '../misc/BannerScore';

// ----------------------------------------------------------------------

type Props = {
  pieces: Piece[],
  active_player_id: number | undefined,
  this_player: Player,
  color_scheme: ColorScheme,
  current_state: GameStatus,
  score_to_win: number,
  team_scores: Score[],
  bar_height: number,
  endTurn: any,
};

// ----------------------------------------------------------------------

export default function MainBBar({ pieces, this_player, color_scheme, score_to_win, team_scores, active_player_id, current_state, bar_height, endTurn }: Props) {

  const theme = useTheme();
  const max_height = 80;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{
            position: 'fixed',
            top: 'auto',
            bottom: 0,
            backgroundColor: calcHexToRGB(theme.palette.grey[900], 0.75),
            height: bar_height,
            maxHeight: max_height,
            justifyContent: 'center',
          }}
        >
          <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>

            { pieces &&
            <Box width={'100%'} sx={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <BannerScore bar_height={bar_height < max_height ? bar_height : max_height} player_id={0} team_scores={team_scores} score_to_win={score_to_win} />
            </Box> }

            <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
              <BBarActionArea
                bar_height={bar_height < max_height ? bar_height : max_height}
                active_player_id={active_player_id}
                this_player_id={this_player.number}
                color_scheme={color_scheme}
                current_state={current_state}
                this_player_ready={this_player.ready}
                endTurn={endTurn}
              />
            </Stack>

            { pieces &&
            <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
              <BannerScore bar_height={bar_height < max_height ? bar_height : max_height} player_id={1} team_scores={team_scores} score_to_win={score_to_win} />
            </Stack> }

          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}