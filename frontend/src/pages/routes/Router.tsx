import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// components
import MainBoard from '../MainBoard';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    {
      path: 'main',
      children: [
        { path: 'app', element: <MainBoard /> },
      ],
    },
    {
      path: '/',
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
