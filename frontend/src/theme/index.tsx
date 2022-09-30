import { useMemo, ReactNode } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
//
import palette from './palette';
import breakpoints from './breakpoints';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: palette.dark,
      breakpoints,
      shape: { borderRadius: 8 },
      direction: 'ltr',
      shadows: shadows.dark,
      customShadows: customShadows.dark,
    }),
    []
  );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
