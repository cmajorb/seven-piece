import { AppBar, Box, Toolbar, useTheme, Stack } from '@mui/material';
import { ColorScheme, Piece, PieceActions } from '../types';
import GetBorderColor from '../utils/getBorderColor';
import Iconify from './Iconify';
import PieceStatStack from './PieceStatStack';

// ----------------------------------------------------------------------

type Props = {
  pieces: Piece[],
  active_player_id: number | undefined,
  selected_tile: number[],
  selected_action: PieceActions,
  this_player_id: number,
  color_scheme: ColorScheme,
  updateSelected: any,
  handleActionType: any,
};

// ----------------------------------------------------------------------

export default function PieceBottomBar(
  { pieces, selected_tile, selected_action, this_player_id, color_scheme, 
    active_player_id, updateSelected, handleActionType
  }: Props) {

  const theme = useTheme();

  return (
    <>
      <Box sx={{ flexGrow: 1, pt: 1 }}>
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, backgroundColor: theme.palette.grey[900], height: 110, justifyContent: 'center' }}>
          <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-around' }}>
            <Stack direction={'row'} spacing={6} justifyContent={'space-between'} alignItems={'center'}>
              {pieces.map((piece: Piece) => ( piece.player === 0 && (
                <PieceStatStack
                  piece={piece}
                  selected_tile={selected_tile}
                  selected_action={selected_action}
                  this_player_id={this_player_id}
                  color_scheme={color_scheme}
                  updateSelected={updateSelected}
                  handleActionType={handleActionType}
                />
              ) ))}
            </Stack>

            { (active_player_id !== undefined && active_player_id === 1) && <Box sx={{ p: 10 }}/> }
            { active_player_id !== undefined &&
              <Iconify
                icon={active_player_id === 0 ? 'eva:arrowhead-left-outline' : 'eva:arrowhead-right-outline'}
                width={70}
                height={70}
                color={GetBorderColor(color_scheme, active_player_id, true)}
              /> }
            { (active_player_id !== undefined && active_player_id === 0) && <Box sx={{ p: 10 }}/> }

            <Stack direction={'row'} spacing={6} justifyContent={'space-between'} alignItems={'center'}>
              {pieces.map((piece: Piece) => ( piece.player === 1 && (
                <PieceStatStack
                  piece={piece}
                  selected_tile={selected_tile}
                  selected_action={selected_action}
                  this_player_id={this_player_id}
                  color_scheme={color_scheme}
                  updateSelected={updateSelected}
                  handleActionType={handleActionType}
                />
              ) ))}
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}