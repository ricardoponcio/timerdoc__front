import { createContext } from 'react';
import { DocumentGeneral } from '../../types/Documets';
import { Company } from '../../types/Empresa';

export type CompanyContextType = {
  company: Company | null;
  document: DocumentGeneral | null;
  loading: boolean;
};

export const CompanyContext = createContext<CompanyContextType>(null!);
