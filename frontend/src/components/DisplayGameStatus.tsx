import { keyframes } from '@mui/system';
import Stack from '@mui/material/Stack';
import { WebSocketStatus } from '../types';
import { Card, Tooltip, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

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

export default function DisplayConnection({ connection_status, current_state }: Props) {

  const theme = useTheme();
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const getConnectionColor = (connection_status: WebSocketStatus) => {
    if (connection_status === ('Connecting' || 'Closing')) { return theme.palette.warning.light }
    else if (connection_status === 'Open') { return theme.palette.success.light }
    else if (connection_status === 'Closed') { return theme.palette.error.light }
    else { return theme.palette.grey[500] };
  };

  return (
    <Card sx={{ p: 1, backgroundColor: theme.palette.grey[100] }}>
      <Stack alignItems={'center'}>
        <Tooltip open={tooltipOpen} onClose={handleTooltipClose} onOpen={handleTooltipOpen} enterDelay={1250} title={connection_status}>
          <Stack direction="row" spacing={0.5}>
            <Typography>WebSocket</Typography>
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ animation: `${ripple} 0.85s infinite alternate ease-in-out` }}>
              <div style={{ backgroundColor: getConnectionColor(connection_status), borderRadius: '50%', width: '10px', height: '10px', justifyContent: 'center', alignItems: 'center' }}/>
            </Stack>
          </Stack>
        </Tooltip>
        <Typography>Game State: {current_state}</Typography>
      </Stack>
    </Card>
  );
}

