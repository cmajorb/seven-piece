import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// components
import LoadingScreen from '../LoadingScreen';
import { PATH_DASHBOARD } from './paths';
// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  
  return useRoutes([
    // {
    //   path: 'auth',
    //   children: [
    //     {
    //       path: 'login',
    //       element: (
    //         <Login />
    //       ),
    //     },
    //     { path: 'register', element: <Register /> },
    //   ],
    // },
    {
      path: 'dashboard',
      element: <MainAppBar />,
      children: [
        { element: <Navigate to={PATH_DASHBOARD.general.start} replace />, index: true },
        {
          path: 'main',
          children: [
            { path: 'start', element: <StartGame /> },
            { path: 'board/:game_id', element: <MainBoard /> },
          ],
        },
      ],
    },
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_DASHBOARD.general.start} replace />, index: true },
      ],
    },
    // {
    //   path: '*',
    //   children: [
    //     { path: '404', element: <NotFound /> },
    //     { path: '*', element: <Navigate to="/404" replace /> },
    //   ],
    // },
  ]);
}

const MainBoard = Loadable(lazy(() => import('../MainBoard')));
const StartGame = Loadable(lazy(() => import('../StartGame')));
// const NotFound = Loadable(lazy(() => import('../Page404')));
// const Login = Loadable(lazy(() => import('../Login')));
// const Register = Loadable(lazy(() => import('../Register')));
const MainAppBar = Loadable(lazy(() => import('../MainAppBar')));