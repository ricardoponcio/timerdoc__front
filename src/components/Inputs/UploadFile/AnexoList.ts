export type AnexoItem = {
  file?: File;
  id: number;
  name: string;
  icon?: JSX.Element;
  type?: JSX.Element;
  size?: number | string;
  readableSize: string;
  preview?: string;
  progress: number;
  uploaded: boolean;
  error: boolean;
  url: string | null;
  date?: Date;
};
