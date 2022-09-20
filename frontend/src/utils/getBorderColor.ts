import { ColorScheme } from '../types';

// ----------------------------------------------------------------------

export default function GetBorderColor (color_scheme: ColorScheme, player_id: number, selected: boolean) {
    if (selected) {
      if (player_id === 0) { return color_scheme.start_tiles[0] }
      else if (player_id === 1) { return color_scheme.start_tiles[1] }
    } else { return color_scheme.tile_colors.wall };
  }