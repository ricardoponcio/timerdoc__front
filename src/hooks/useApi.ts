import axios from 'axios';
import { useEffect, useState } from 'react';
import { getI18n } from 'react-i18next';
import { LoginCompanySucess, LoginSucess } from 'types/Responses/LoginResponse';
import { Company } from '../types/Empresa';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
const i18n = getI18n();
const requestAuth = api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const setToken = (t?: string) => {
  if (t) localStorage.setItem('authToken', t);
  const token = t || localStorage.getItem('authToken');
  api.interceptors.request.eject(requestAuth);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const useApi = () => ({
  setHeadersAuthByLocal: async (t?: string) => setToken(t),
  singin: async (email: string, password: string) => {
    try {
      const response = await api.post<LoginSucess>('/auth/login', { email, password });
      setToken(response.data.access_token);

      return response?.data;
    } catch (e) {
      console.error('Erro no login', e);
      throw e;
    }
  },
  selectCompany: async (id: number) => {
    const response = await api.get<LoginCompanySucess>(`/company/${id}/select`);

    return response?.data;
  },
  singout: async () => {
    api.interceptors.request.eject(requestAuth);
    localStorage.removeItem('authToken');
  },
  setLanguageApi: () => {
    api.interceptors.request.use((config) => {
      config.headers['Accept-Language'] = i18n.language;
      return config;
    });
  },
});
export async function selectCompany(id: number) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const response = await api.get<LoginCompanySucess>(`/company/${id}/select`);

  setLoading(false);
  setCompany(response.data.company_data);
  api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  setToken(response.data.access_token);

  return { company, loading };
}
export function useGet<T = unknown>(url: string, discartUrlBase = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setLoading(false);
      setData(response.data);
    })();
  }, []);

  return { data, loading };
}
