import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from './routes/paths';

// ----------------------------------------------------------------------

export default function MainAppBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [currentSession, setCurrentSession] = useState<string | undefined>();

  useEffect(() => {
    if (pathname.includes(PATH_DASHBOARD.general.board)) { setCurrentSession(pathname.split('/').pop()) }
    else { setCurrentSession(undefined) };
  }, [pathname]);

  const copy = async (current_session: string | undefined) => {
    if (current_session) { await navigator.clipboard.writeText(current_session) };
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, pb: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction={'row'} alignItems={'center'}>
              { currentSession &&
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <Typography variant="button">Session:</Typography>
                <Button color="inherit" style={{ textTransform: 'lowercase' }} onClick={() => { console.log('copied'); copy(currentSession) }}>{currentSession}</Button>
              </Stack> }
            </Stack>
            <Button color="inherit" onClick={() => { navigate(PATH_DASHBOARD.general.start) }}>Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}