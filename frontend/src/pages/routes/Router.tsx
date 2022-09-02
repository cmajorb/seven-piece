import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// components
import LoadingScreen from '../LoadingScreen';
import { PATH_DASHBOARD, PATH_AUTH } from './paths';
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
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <Login />
          ),
        },
        { path: 'register', element: <Register /> },
      ],
    },
    {
      path: 'dashboard',
      children: [
        { element: <Navigate to={PATH_DASHBOARD.general.board} replace />, index: true },
        {
          path: 'main',
          children: [
            { path: 'board', element: <MainBoard /> },
          ],
        },
      ],
    },
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AUTH.login} replace />, index: true },
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
// const NotFound = Loadable(lazy(() => import('../Page404')));
const Login = Loadable(lazy(() => import('../Login')));
const Register = Loadable(lazy(() => import('../Register')));