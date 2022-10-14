import { AppBar, Box, Toolbar, useTheme, Stack } from '@mui/material';
import { ColorScheme, GameStatus, Piece, Player, Score } from '../../types';
import BBarActionArea from './B-BarActionArea';
import calcHexToRGB from '../../utils/calcHexToRGB';
import BannerScore from './BannerScore';

// ----------------------------------------------------------------------

type Props = {
  pieces: Piece[],
  active_player_id: number | undefined,
  this_player: Player,
  color_scheme: ColorScheme,
  current_state: GameStatus,
  score_to_win: number,
  team_scores: Score[],
  endTurn: any,
};

// ----------------------------------------------------------------------

export default function MainBBar({ pieces, this_player, color_scheme, score_to_win, team_scores, active_player_id, current_state, endTurn }: Props) {

  const theme = useTheme();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{
            position: 'fixed',
            top: 'auto',
            bottom: 0,
            backgroundColor: calcHexToRGB(theme.palette.grey[900], 0.75),
            height: 80,
            justifyContent: 'center',
          }}
        >
          <Toolbar sx={{ alignItems: 'center' }}>

            { pieces &&
            <Box width={'100%'} sx={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <BannerScore player_id={0} team_scores={team_scores} score_to_win={score_to_win} />
            </Box> }

            <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'center'}>
              <BBarActionArea
                active_player_id={active_player_id}
                this_player_id={this_player.number}
                color_scheme={color_scheme}
                current_state={current_state}
                score_to_win={score_to_win}
                this_player_ready={this_player.ready}
                endTurn={endTurn}
              />
            </Stack>

            { pieces &&
            <Stack direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
              <BannerScore player_id={1} team_scores={team_scores} score_to_win={score_to_win} />
            </Stack> }

          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}