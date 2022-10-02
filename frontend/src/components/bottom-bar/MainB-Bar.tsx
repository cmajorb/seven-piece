import { AppBar, Box, Toolbar, useTheme, Stack } from '@mui/material';
import { ColorScheme, Piece } from '../../types';
import BBarActionArea from './B-BarActionArea';
import PieceStatStack from './PieceStatStack';
import calcHexToRGB from '../../utils/calcHexToRGB';

// ----------------------------------------------------------------------

type Props = {
  pieces: Piece[],
  selected_piece: Piece | undefined,
  active_player_id: number | undefined,
  selected_tile: number[],
  this_player_id: number,
  color_scheme: ColorScheme,
  current_state: string,
  score_to_win: number,
  updateSelected: any,
  endTurn: any,
  setPieces: any,
};

// ----------------------------------------------------------------------

export default function MainBBar(
  { pieces, selected_piece, selected_tile, this_player_id, color_scheme, score_to_win,
    active_player_id, current_state, updateSelected, endTurn, setPieces
  }: Props) {

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
            height: 110,
            justifyContent: 'center'
          }}
        >
          <Toolbar sx={{ pt: 0.2, alignItems: 'center', justifyContent: 'space-around' }}>

            { pieces &&
            <Stack direction={'row'} spacing={6} justifyContent={'space-between'} alignItems={'center'}>
              {pieces.map((piece: Piece) => ( piece.player === 0 && (
                <PieceStatStack
                  key={piece.player + piece.id + piece.name}
                  this_piece={piece}
                  selected_piece={selected_piece}
                  selected_tile={selected_tile}
                  this_player_id={this_player_id}
                  color_scheme={color_scheme}
                  updateSelected={updateSelected}
                />
              ) ))}
            </Stack> }

            <BBarActionArea
              active_player_id={active_player_id}
              this_player_id={this_player_id}
              color_scheme={color_scheme}
              current_state={current_state}
              score_to_win={score_to_win}
              endTurn={endTurn}
              setPieces={setPieces}
            />

            { pieces &&
            <Stack direction={'row'} spacing={6} justifyContent={'space-between'} alignItems={'center'}>
              {pieces.map((piece: Piece) => ( piece.player === 1 && (
                <PieceStatStack
                  key={piece.player + piece.id + piece.name}
                  this_piece={piece}
                  selected_piece={selected_piece}
                  selected_tile={selected_tile}
                  this_player_id={this_player_id}
                  color_scheme={color_scheme}
                  updateSelected={updateSelected}
                />
              ) ))}
            </Stack> }

          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}