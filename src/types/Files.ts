export type Anexo = {
  id: number;
  nome: string;
  nomeArquivo: string;
  referencia: string;
  // dataAtualizacao: Date;
  dataCriacao: Date;
  tamanho?: string | number;
  tipoArquivo: string | null;
  caminhoS3: string | null;
};
