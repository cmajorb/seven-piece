import { useTheme } from '@mui/material/styles';
import { Map } from '../types';

// ----------------------------------------------------------------------

export function GetWallColor (map: Map) {
    const theme = useTheme();
    if (map.color_scheme.tile_colors.wall === 'black') { return theme.palette.common.black }
    else if (map.color_scheme.tile_colors.wall === 'white') { return theme.palette.common.white }
    else if (map.color_scheme.tile_colors.wall === 'blue') { return theme.palette.primary.main }
    else if (map.color_scheme.tile_colors.wall === 'light_blue') { return theme.palette.primary.light }
    else if (map.color_scheme.tile_colors.wall === 'dark_blue') { return theme.palette.primary.dark }
  }
