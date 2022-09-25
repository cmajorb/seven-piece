import { Suspense, lazy, ElementType, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { WebSocketStatus } from '../../types';
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
  
  const [connectionStatus, setConnectionStatus] = useState<WebSocketStatus>('Uninstantiated');
  const [currentState, setCurrentState] = useState<string>('');

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
      element: <MainAppBar connection_status={connectionStatus} current_state={currentState} />,
      children: [
        { element: <Navigate to={PATH_DASHBOARD.general.start} replace />, index: true },
        {
          path: 'main',
          children: [
            { path: 'start', element: <StartGame /> },
            { path: 'board/:game_id', element: <MainBoard setConnectionStatus={setConnectionStatus} setCurrentState={setCurrentState} /> },
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