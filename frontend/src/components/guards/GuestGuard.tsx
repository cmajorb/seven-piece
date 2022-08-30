import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import { isValidToken } from '../../utils/jwt';
// routes
import { PATH_AUTH } from '../../pages/routes/paths';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  let token = localStorage.getItem('accessToken') ?? '';
  
  if  (!isValidToken(token)) {
    return <Navigate to={PATH_AUTH.root} />;
  }

  return <>{children}</>;
}
