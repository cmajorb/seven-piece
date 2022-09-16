import { useTheme } from '@mui/material/styles';
import { ColorScheme } from '../types';

// ----------------------------------------------------------------------

export default function GetBorderColor (contains_piece_or_obj: boolean, color_scheme: ColorScheme, player_id: number, selected: boolean) {
    const theme = useTheme();
    if (selected) {
      return theme.palette.primary.main
    } else if (!contains_piece_or_obj) {
      return color_scheme.tile_colors.wall;
    } else if (player_id < 0) {
      return color_scheme.tile_colors.wall;
    } else if (player_id === 0) {
      return color_scheme.start_tiles[0];
    } else if (player_id === 1) {
      return color_scheme.start_tiles[1];
    } else { return color_scheme.tile_colors.wall };
  }