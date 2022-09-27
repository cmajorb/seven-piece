import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx }: Props) {

  const logo = (
    <Box sx={{ width: 80, height: 40, ...sx }}>
      <img src="/images/crossed_swords.svg" alt="NFTy Arcade" width="100%" height="140%"/>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/dashboard/app">{logo}</RouterLink>;
}
