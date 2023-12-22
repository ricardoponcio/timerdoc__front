export enum RoleEnum {
  ADM = 'ADM',
  GESTOR = 'Gestor',
  USUARIO = 'Usuario',
  VISUALIZADOR = 'Visualizador',
}
export type Role = {
  nome: string;
  ordem: number;
};
