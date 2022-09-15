import { useTheme } from '@mui/material/styles';
import { ColorScheme } from '../types';

// ----------------------------------------------------------------------

export function GetWallColor (color_scheme: ColorScheme) {
    const theme = useTheme();
    if (color_scheme.tile_colors.wall === 'black') { return theme.palette.common.black }
    else if (color_scheme.tile_colors.wall === 'white') { return theme.palette.common.white }
    else if (color_scheme.tile_colors.wall === 'blue') { return theme.palette.primary.main }
    else if (color_scheme.tile_colors.wall === 'light_blue') { return theme.palette.primary.light }
    else if (color_scheme.tile_colors.wall === 'dark_blue') { return theme.palette.primary.dark }
  }
