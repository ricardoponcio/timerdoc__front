import * as Yup from 'yup';

export type LoginField = {
  email: string;
  password: string;
};

export const schemaValidationLogin = Yup.object({
  email: Yup.string().email('Email invalido').required('Preenchimento obrigatório'),
  password: Yup.string().min(3, 'Minimo 3 caracteres').required('Preenchimento obrigatório'),
});
export type EmailField = {
  email: string;
};
export const schemaValidationEmail = Yup.object({
  email: Yup.string().email('Email invalido').required('Preenchimento obrigatório'),
});
