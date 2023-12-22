import 'i18n';
import moment from 'moment';
import 'moment/dist/locale/en-ca';
import 'moment/dist/locale/pt';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.sass';
import AppRoutes from './Routes';

const App = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    moment.locale(i18n.language);
  }, []);

  return <AppRoutes />;
};

export default App;
