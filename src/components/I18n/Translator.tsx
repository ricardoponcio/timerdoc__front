import { useTranslation } from 'react-i18next';
// Importamos o hook

const Translator = ({ path }: { path: string }) => {
  const { t } = useTranslation(); // Função que traduz

  // Retornamos a função passando como parametro o caminho (path)
  // de onde está localizado o texto que desejamos traduzir
  return t(path);
};

export default Translator;
