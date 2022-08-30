import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from './routes/paths';
// sections
import RegisterForm from '../components/forms/RegisterForm';

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

export default function Register() {
  return (
      <RootStyle>
        <Container>
          <ContentStyle>

            <RegisterForm />

            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
                Login
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
  );
}
