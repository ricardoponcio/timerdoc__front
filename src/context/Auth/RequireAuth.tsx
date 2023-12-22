import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const RequireAuth = ({ children }: { children?: JSX.Element }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    const noRedirect = ['/login', '/'];

    const location = useLocation();
    const path = noRedirect.some((n) => n === location.pathname)
      ? ''
      : '?to=' + location.pathname.concat(location.search);
    return <Navigate to={'/login' + path} />;
  }

  return children || <Outlet />;
};
