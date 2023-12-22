import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AlertAppBeta = () => {
  const { t } = useTranslation();
  return (
    <Alert
      status="warning"
      variant="top-accent"
      fontSize={'0.8em'}
      marginBottom={'10px'}
    >
      <AlertIcon />
      <Box>
        <AlertTitle>{t('orthers.alterAppBetaVersionTitle')}</AlertTitle>
        <AlertDescription>{t('orthers.alterAppBetaVersion')}</AlertDescription>
      </Box>
    </Alert>
  );
};
