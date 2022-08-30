import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import { isValidToken } from '../../utils/jwt';
// pages
import Login from '../../pages/Login';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  let token = localStorage.getItem('accessToken') ?? '';

  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isValidToken(token)) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
