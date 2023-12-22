import * as Yup from 'yup';
import { removeMaskCnpj, validateCnpj } from '../services/ObjectsUtils';
import { Role } from './Role';

export type Company = {
  id: number;
  razaoSocial: string;
  fantasia?: string;
  cnpj: string;
  planoId?: number;
};

export type CompanyRole = { empresa: Company; role: Role };

export type CompanyCreate = {
  razaoSocial: string;
  fantasia: string;
  cnpj: string;
};

export const schemaValidationCompanyCreate = Yup.object({
  razaoSocial: Yup.string().required(),
  fantasia: Yup.string(),
  cnpj: Yup.string()
    .required()
    .transform(removeMaskCnpj)
    .max(14, 'Máximo 14')
    .min(14, 'Mímino 14')
    .test('', 'CNPJ invalido', validateCnpj),
});
