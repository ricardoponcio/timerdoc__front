import { createContext } from 'react';
import { Company } from 'types/Empresa';
import { User } from 'types/User';

export type AuthContextType = {
  user: User | null;
  setUser: (user: React.SetStateAction<User | null>) => void;
  company: Company | null;
  companys: Company[] | null;
  loading: boolean;
  getCompanys: () => Company[];
  getCompany: () => Company | undefined;
  updateCompanyList: (id: number, company: Partial<Company>) => void;
  signin: (email: string, password: string) => Promise<boolean>;
  singout: () => void;
  selectCompany: (idCompany: number, com?: Company[]) => Promise<boolean>;
  setCompanyAuth: (company: Company | null) => void;
  // expiredToken: (token: string) => boolean;
};

export const AuthContext = createContext<AuthContextType>(null!);
