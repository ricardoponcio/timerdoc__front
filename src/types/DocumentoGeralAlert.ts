import { DocumentGeneral } from './Documets';

export type DocumentGeneralAlert = {
  id: number;
  dataHora: Date;
  mensagem: string;
  descricao: string;
  tipo: 'F' | 'P' | 'C';
  prioridade: Priority;
  prioridadeOrdem: number;
  resolucao: boolean;
  documentoGeral: DocumentGeneral;
};

export enum Priority {
  INFO = 'INFO',
  WARN = 'WARN',
  ERRO = 'ERRO',
}
