import { Company } from 'types/Empresa';
import { User } from '../User';

export type Login = {
  email: string;
  password: string;
};
export type LoginSucess = {
  type: string;
  access_token: string;
  user: User;
};
export type LoginCompanySucess = {
  access_token: string;
  company_data: Company;
};
export type LoginUnauthorized = {
  status: boolean;
  message: string;
};
