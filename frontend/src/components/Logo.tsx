import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ disabledLink = false, sx }: Props) {

  const logo = (
    <Box sx={{ width: 70, height: 70, ...sx }}>
      <img src="https://d36mxiodymuqjm.cloudfront.net/website/icons/icon-element-neutral-2.svg" alt="Blood for Glory" width={70} height={70}/>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/dashboard/app">{logo}</RouterLink>;
}
