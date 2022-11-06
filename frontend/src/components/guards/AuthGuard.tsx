import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// pages
import Login from '../../pages/Login';
import { isValidToken, refreshAccessToken, setSession } from '../../utils/jwt';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const is_authenticated = isValidToken(localStorage.getItem("accessToken") || '');
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!is_authenticated) {
    let refresh = localStorage.getItem('refreshToken');
    refreshAccessToken(refresh).then((res) => {
      setSession(res.access, res.refresh);

      let new_token = localStorage.getItem('accessToken') || '';
      if (!isValidToken(new_token)) {
        if (pathname !== requestedLocation) {
          setRequestedLocation(pathname);
        }
        console.log("Going to login");
        return <Login />;
      }
    });
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
