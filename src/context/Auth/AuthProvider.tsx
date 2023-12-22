import { api, useApi } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { CompanyRole } from 'types/CompanyTypes';
import { Company } from 'types/Empresa';
import { User } from 'types/User';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [companys, setCompanys] = useState<Company[] | null>(null);
  const [loading, setLoading] = useState(true);

  const getCompanys = (): Company[] => {
    if (companys) return companys;
    const listLocal: CompanyRole[] = JSON.parse(localStorage.getItem('listCompanys') || '{}');
    // setCompanys(listLocal);
    return listLocal.map((c) => c.empresa);
  };
  const getCompany = (): Company | undefined =>
    company || JSON.parse(localStorage.getItem('companyData') || '{}');

  const validadeLogateUser = async () => {
    const storageDataToken = localStorage.getItem('authToken');
    if (storageDataToken && !expiredToken(storageDataToken)) {
      const api = useApi();
      api.setLanguageApi();
      const testUser: User = JSON.parse(localStorage.getItem('_u') || '{}');

      if (testUser && testUser.manterLogado) {
        setUser(testUser);
        return;
      }
    }
  };
  useEffect(() => {
    validadeLogateUser().then(() => setLoading(false));
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await useApi().singin(email, password);

    if (response.user && response.access_token) {
      response.user.manterLogado = true;

      const api = useApi();
      api.setLanguageApi();
      setUserLs(response.user);
      setUser(response.user);
      setToken(response.access_token);
      return true;
    }
    return false;
  };

  const selectCompany = async (id: number, coms?: Company[]) => {
    if (coms) {
      setCompanys(coms);
    }

    const response = await api.get<{
      access_token: string;
      company_data: Company;
    }>(`/company/${id}/select`);

    if (response.data && response.data.access_token) {
      setCompanyAuth(response.data.company_data);
      setToken(response.data.access_token);
      return true;
    }
    return false;
  };
  const setCompanyAuth = (company: Company | null) => {
    setCompany(company);
    localStorage.setItem('companyData', JSON.stringify(company));
  };
  const updateCompanyList = (id: number, company: Partial<Company>) => {
    if (companys) {
      const updateCompanys = companys.map((comp) =>
        comp.id === id ? { ...comp, ...company } : comp
      );
      setCompanys(updateCompanys);
      localStorage.setItem('listCompanys', JSON.stringify(updateCompanys));
    }
  };

  const singout = async () => {
    await useApi().singout();
    setUser(null);
    localStorage.removeItem('companyData');
    localStorage.removeItem('listCompanys');
    localStorage.removeItem('_u');
  };

  const expiredToken = (token: string): boolean => {
    const decodedJwt = parseJwt(token);

    return decodedJwt.exp * 1000 < Date.now();
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(window.atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const setToken = (token: string) => useApi().setHeadersAuthByLocal(token);
  const setUserLs = (user: User) => localStorage.setItem('_u', JSON.stringify(user));
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        company,
        companys,
        getCompanys,
        setCompanyAuth,
        updateCompanyList,
        signin,
        singout,
        selectCompany,
        loading,
        getCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
