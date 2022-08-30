import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from './routes/paths';
// sections
import LoginForm from '../components/forms/LoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {

  return (
      <RootStyle>
        <Container>
          <ContentStyle>

            <LoginForm />

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Get started
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
  );
}
