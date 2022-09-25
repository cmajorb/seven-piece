import { Theme } from "@mui/material";
import { WebSocketStatus } from "../types";

// ----------------------------------------------------------------------

export default function getConnectionColor (connection_status: WebSocketStatus, theme: Theme) {
    if (connection_status === ('Connecting' || 'Closing')) { return theme.palette.warning.light }
    else if (connection_status === 'Open') { return theme.palette.success.light }
    else if (connection_status === 'Closed') { return theme.palette.error.light }
    else { return theme.palette.grey[500] };
  };