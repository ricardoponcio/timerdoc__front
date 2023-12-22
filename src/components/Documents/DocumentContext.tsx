import { createContext } from 'react';
import { DocumentGeneral } from 'types/Documets';

export type DocumentContextType = {
  document: DocumentGeneral | null;
  setDocument: (document: React.SetStateAction<DocumentGeneral | null>) => void;
};

export const DocumentContext = createContext<DocumentContextType>(null!);
