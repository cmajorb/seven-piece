import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button
} from '@mui/material';
import { Stack } from '@mui/system';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ConnectWebSocket } from '../utils/connectWebSocket';
import { PATH_DASHBOARD } from './routes/paths';

// ----------------------------------------------------------------------

export default function MainAppBar() {
  const navigate = useNavigate();
  const { game_id } = useParams();
  // const path_str = "game/" + game_id;
  // const connectionStatus = ConnectWebSocket(path_str);

  return (
    <>
      <Box sx={{ flexGrow: 1, pb: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction={'row'} alignItems={'center'}>
              <Stack direction={'row'} spacing={1}>
                <Typography variant="button">WebSocket:</Typography>
                {/* <Typography variant="button">{connectionStatus}</Typography> */}
              </Stack>
            </Stack>
            <Button color="inherit" onClick={() => { navigate(PATH_DASHBOARD.general.start) }}>Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}