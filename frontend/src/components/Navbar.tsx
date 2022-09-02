import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Box, AppBar, Toolbar, Button } from '@mui/material';

export function Navbar() {
    const { user, logout } = useContext(AuthContext);
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            {!user ?
                <Button color="inherit" href="/login">Login</Button> :
                <Button color="inherit" onClick={logout}>Logout</Button>
            }
            </Toolbar>
        </AppBar>
        <Outlet />
        </Box>
    );
}