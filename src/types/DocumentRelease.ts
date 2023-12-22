import * as Yup from 'yup';
import { Anexo } from './Files';
import { User } from './User';

export enum SituacaoRelease {
  INICIADO = 'INICIADO',
  BLOQUEADO = 'BLOQUEADO',
  ENTREGUE = 'ENTREGUE',
}

export type DocumentRelease = {
  id?: number;
  competenciaReferencia: string;
  entrega: Date;
  situacao: SituacaoRelease;
  descricao?: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;
  dataRemocao?: Date;
  prazo: Date;
  anexos?: Anexo[];
  observacoes: ReleaseNote[];
  size?: string | number;
};

export type DocReleaseCreate = {
  entrega: string;
  situacao: SituacaoRelease;
  descricao: string;
  prazo: string;
  competenciaReferencia: string;
};

export const schemaValidationRelease = Yup.object({
  entrega: Yup.date().required(),
  prazo: Yup.date()
    .required()
    .when(
      'entrega',
      (entrega, yup) => entrega && yup.min(entrega, 'Prazo não pode ser anterior a entrega')
    ),
  situacao: Yup.mixed<SituacaoRelease>().oneOf(Object.values(SituacaoRelease)).required(),
  descricao: Yup.string().nullable(),
  competenciaReferencia: Yup.string().required(),
});

export type ReleaseNote = {
  id: number;
  dataCriacao: Date;
  observacao: string;
  usuario: User;
};
export type ReleaseCreateNote = {
  observacao: string;
};
export const schemaValidationReleaseNote = Yup.object({
  observacao: Yup.string().min(5, 'Minimo 5 letras').required(),
});
