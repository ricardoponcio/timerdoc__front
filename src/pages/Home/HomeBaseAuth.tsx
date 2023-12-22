import SimpleSidebar from 'components/Sidebar/SimpleSidebar';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from '../../components/Topbar/Topbar';
import { AuthContext } from '../../context/Auth/AuthContext';
import { RequireAuth } from '../../context/Auth/RequireAuth';
import { CompanyContext } from '../../context/Company/CompanyContext';
import { Company } from '../../types/Empresa';
import './Home.sass';

export default function HomeBase() {
  const auth = useContext(AuthContext);

  const company: Company | null =
    auth.company || JSON.parse(localStorage.getItem('companyData') || '{}');

  return (
    <RequireAuth>
      <main id="home">
        <CompanyContext.Provider value={{ company: company, document: null, loading: false }}>
          {/* <Sidebar collapsed={collapsedSidebar} /> */}
          <SimpleSidebar>
            <div id="container-main">
              <Topbar />
              {/* {children?} */}
              <div className="content-page">
                <Outlet />
              </div>
            </div>
          </SimpleSidebar>
        </CompanyContext.Provider>
      </main>
    </RequireAuth>
  );
}
