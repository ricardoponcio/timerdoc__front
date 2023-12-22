import * as Yup from 'yup';
import { Company } from './Empresa';
import { Role, RoleEnum } from './Role';
import { UserSimpleDTO } from './User';

export type Invite = {
  id: number;
  dataCriacao: Date;
  dataRemocao: null | Date;
  emailConvidado: string;
  nomeConvidado: string;
  status: null | string;
  usuarioOrigem: UserSimpleDTO;
  empresaConvite: Company;
  role: Role;
};
export type InviteDto = {
  id: number;
  dataCriacao: Date;
  emailConvidado: string;
  nomeConvidado: string;
  // usuarioOrigem: UserSimpleDTO;
  role: Role;
};
export type InviteCreate = {
  nome: string;
  email: string;
  roleName: RoleEnum;
};
export const schemaValidationInviteCreate = Yup.object({
  nome: Yup.string().max(255, 'Maximo de caracteres 255').required('Preenchimento obrigatório'),
  email: Yup.string().email('Email invalido').required(),
  roleName: Yup.mixed<RoleEnum>().oneOf(Object.values(RoleEnum)).required(),
});
