import * as Yup from 'yup';
import { PeriodicidadeDocumento } from './DocumentPeriodicity';
import { User } from './User';

export type DocumentGeneral = {
  id: number;
  nome: string;
  descricao: string;
  lancamento: Date;
  dataRemocao: null;
  recorrencia: number;
  periodicidade: PeriodicidadeDocumento;
  inicioContagem: Date;
  fimContagem?: Date;
  valorPadrao: number;
  diasAvisoVencimento: number;
  usuario?: User;
};

export type DocumentCreate = {
  nome: string;
  descricao: string; // Pode ser nulo
  recorrencia: number;
  periodicidade: PeriodicidadeDocumento;
  inicioContagem: string;
  fimContagem: string; // Pode ser nulo
  valorPadrao: number;
  diasAvisoVencimento: number;
};

export const schemaValidationDocument = Yup.object({
  nome: Yup.string().max(255, 'Maximo de caracteres 255').required('Preenchimento obrigatório'),
  descricao: Yup.string().nullable(),
  diasAvisoVencimento: Yup.number().default(1).required(),
  inicioContagem: Yup.date().required(),
  fimContagem: Yup.date()
    .default(null)
    .when(
      'inicioContagem',
      (inicioContagem, yup) =>
        inicioContagem && yup.min(inicioContagem, 'Data Fim não pode ser anterior a Data Inicio')
    )
    .nullable('Permite nulos'),
  periodicidade: Yup.mixed<PeriodicidadeDocumento>()
    .oneOf(Object.values(PeriodicidadeDocumento))
    .required(),
  recorrencia: Yup.number().default(1).min(0, 'Valor deve ser maior ou igual a 0').required(),
  valorPadrao: Yup.number().required(),
});
