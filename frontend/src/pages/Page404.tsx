import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Typography>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
          </Box>
        </Container>
      </RootStyle>
  );
}
