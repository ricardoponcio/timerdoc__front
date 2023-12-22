import * as Yup from 'yup';
import { Company } from './Empresa';
import { Role, RoleEnum } from './Role';

export type User = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  telefone: string;
  password?: string;

  manterLogado?: boolean;
};

export type UserCreate = {
  nome: string;
  email: string;
  telefone: string;
};
export type UserEdit = {
  nome: string;
  email: string;
  telefone: string;
};
export const schemaValidationUserCreate = Yup.object({
  nome: Yup.string().required('Preenchimento obrigatório'),
  email: Yup.string().email('Email invalido').required('Preenchimento obrigatório'),
  telefone: Yup.string(),
});
export type PasswordValidation = {
  senha: string;
  senhaConfirmacao: string;
};
export const schemaValidationPasswordValidation = Yup.object({
  senha: Yup.string().required('Necessário preenchimento'),
  senhaConfirmacao: Yup.string()
    .oneOf([Yup.ref('senha'), undefined], 'Senhas não coincidem')
    .required('Necessário preenchimento'),
});
export type UserSimpleDTO = {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
};

export type UserCreateInvite = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  senhaConfirmacao: string;
};
export const schemaValidationUserCreateInvite = Yup.object({
  nome: Yup.string().required('Preenchimento obrigatório'),
  email: Yup.string().email('Email invalido').required('Preenchimento obrigatório'),
  telefone: Yup.string(),
  senha: Yup.string().required('Necessário preenchimento'),
  senhaConfirmacao: Yup.string()
    .oneOf([Yup.ref('senha'), undefined], 'Senhas não coincidem')
    .required('Necessário preenchimento'),
});

export type UserCompany = {
  dataRemocao?: string | Date;
  usuario: UserSimpleDTO;
  role?: Role;
  empresa: Company;
};

export type UserCompanyUpdate = {
  roleName: string;
};
export const schemaValidationUserCompanyUpdate = Yup.object({
  roleName: Yup.mixed<RoleEnum>().oneOf(Object.values(RoleEnum)).required(),
});
