import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Paper, Typography, Stack } from '@mui/material';
// routes
import { PATH_AUTH } from './routes/paths';
// sections
import LoginForm from '../components/forms/LoginForm';
import BackgroundImage from '../images/login_background.jpeg';

// ----------------------------------------------------------------------

export default function Login() {

  return (
    <Paper
      square={true}
      sx={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}
    >

    <Stack spacing={3} alignItems={'center'}>
      <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
        <Typography variant={'h2'}>
            Blood
        </Typography>
        <Typography variant={'h4'} sx={{ pl: 0.5 }}>
            for
        </Typography>
        <Typography variant={'h2'}>
            Glory
        </Typography>
      </Stack>

      <LoginForm />

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don’t have an account?{' '}
        <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
          Get started
        </Link>
      </Typography>
    </Stack>
    </Paper>
  );
}