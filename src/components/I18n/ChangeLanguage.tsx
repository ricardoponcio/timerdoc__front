import { Box, Button, Icon } from '@chakra-ui/react';
import { useApi } from 'hooks/useApi';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { GiBrazilFlag, GiUsaFlag } from 'react-icons/gi';

const ButtonI18n = ({
  icon,
  language,
  showAll,
  changeLanguage,
}: {
  icon: IconType;
  language: 'pt-BR' | 'en-US';
  showAll: boolean;
  changeLanguage: (language: string) => void;
}) => {
  const { i18n } = useTranslation();
  return (
    <Button
      visibility={showAll || i18n.language === language ? 'visible' : 'hidden'}
      variant={'ghost'}
      borderRadius={'full'}
      onClick={() => changeLanguage(language)}
    >
      <Icon
        boxSize={8}
        as={icon}
      />
    </Button>
  );
};

export const ChangeLanguage = () => {
  const { i18n } = useTranslation();
  const t = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const hanbleShowAll = () => setShowAll((show) => !show);
  const { setLanguageApi } = useApi();
  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    moment.locale(language);
    setLanguageApi();
  };

  return (
    <Box
      display={'flex'}
      onMouseEnter={hanbleShowAll}
      onMouseLeave={hanbleShowAll}
    >
      <ButtonI18n
        icon={GiBrazilFlag}
        language={'pt-BR'}
        showAll={showAll}
        changeLanguage={handleChangeLanguage}
      />
      <ButtonI18n
        icon={GiUsaFlag}
        language={'en-US'}
        showAll={showAll}
        changeLanguage={handleChangeLanguage}
      />
    </Box>
  );
};
