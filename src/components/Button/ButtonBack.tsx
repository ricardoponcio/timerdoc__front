import { Button, ButtonProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoReturnUpBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export const ButtonBack = (props: ButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Button
      title={t('actions.back')}
      onClick={() => navigate(-1)}
      variant={'ghost'}
      borderRadius="full"
      {...props}
    >
      <IoReturnUpBack />
    </Button>
  );
};
