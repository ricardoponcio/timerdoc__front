import HomeDocumentsDashboard from 'components/DocumentsDashboards/HomeDocumentsDashboard';
import { AuthProvider } from 'context/Auth/AuthProvider';
import { RequireAuth } from 'context/Auth/RequireAuth';
import { NotFound } from 'NotFound/NotFound';
import { CompanyAdd } from 'pages/Company/CompanyAdd/CompanyAdd';
import { CompanyChoice } from 'pages/Company/CompanyChoice/CompanyChoice';
import CompanyEdit from 'pages/Company/CompanyEdit/CompanyEdit';
import { CompanyUsers } from 'pages/Company/CompanyUsers/CompanyUsers';
import { DocumentRead } from 'pages/Documents/DocumentRead';
import HomeBaseAuth from 'pages/Home/HomeBaseAuth';
import { InvitePage } from 'pages/Invites/InvitePage';
import { NewAccountInvite } from 'pages/Invites/NewAccountInvite';
import { Login } from 'pages/Login/Login';
import { UserValidation } from 'pages/User/Validation/UserValidation';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// prettier-ignore
export default function AppRoutes() {
  const routesPasswordConfim = [{
    keyI18n: 'orthers.passwordSetting',
    path: '/validation/:hash',
    verifyApi: 'auth/verify/:hash'
  },{
    keyI18n: 'orthers.passwordSetting',
    path: '/recover-password/:hash',
    verifyApi: 'auth/recover-password/:hash'
  },{
    keyI18n: 'common.lblDisableAccount',
    path: '/delete-account/:hash',
    verifyApi: '/user/remove/:hash/verify'
  }];
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/complete-register/:hash" element={<NewAccountInvite />} />
          {routesPasswordConfim.map(route =>
            <Route 
              key={route.path}
              path={route.path}
              element={<UserValidation verify={route.verifyApi} title={route.keyI18n} />} />)}
          <Route path="/companys" element={<RequireAuth />}>
            <Route index element={<CompanyChoice />} />
            <Route path="add" element={<CompanyAdd />} />
          </Route>
          <Route path="/" element={<HomeBaseAuth />}>
            <Route index element={<HomeDocumentsDashboard />} />
            {['/invites', '/accept-invite/:hash'].map(route =>
              <Route key={route} path={route} element={<InvitePage />} />)}
            <Route path="/users" element={<CompanyUsers />} />
            <Route path="/document/:id" element={<DocumentRead />} />
            <Route path="/companys/:cnpj" element={<CompanyEdit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
