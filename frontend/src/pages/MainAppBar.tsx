import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Typography,
    useTheme,
    Stack,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { WebSocketStatus } from '../types';
import getConnectionColor from '../utils/getConnectionColor';
import { PATH_DASHBOARD } from './routes/paths';

// ----------------------------------------------------------------------

const ripple = (
  keyframes`
  0% {
    transform: scale(.95);
    opacity: 1;
  }
  100% {
    transform: scale(1.05);
    opacity: 0.7;
  }`
);

// ----------------------------------------------------------------------

type Props = {
  connection_status: WebSocketStatus,
  current_state: string,
};

// ----------------------------------------------------------------------

export default function MainAppBar ({ connection_status, current_state }: Props) {

  const theme = useTheme();
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction={'row'} alignItems={'center'}>
              { currentSession &&
              <Stack direction={'row'} alignItems={'center'}>
                <Typography variant="button">Session:</Typography>
                <Button sx={{ pl: 1, pr: 1 }} size='large' color="inherit" style={{ textTransform: 'lowercase' }} onClick={() => { copy(currentSession) }}>{currentSession}</Button>
                <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${ripple} 0.85s infinite alternate ease-in-out` }}>
                  <div style={{ backgroundColor: getConnectionColor(connection_status, theme), borderRadius: '50%', width: '10px', height: '10px', justifyContent: 'center', alignItems: 'center' }}/>
                </Stack>
              </Stack> }
            </Stack>
            { current_state && current_state !== 'None' &&
              <Typography variant='body2'>Game State: {current_state}</Typography>
            }
            <Button color="inherit" onClick={() => { navigate(PATH_DASHBOARD.general.start) }}>Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}