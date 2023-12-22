import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AiOutlineHistory } from 'react-icons/ai';
import { ModalHistory } from './ModalHistory';

export const ButtonHistory = (props: {
  endPonint: string;
  titleHearder?: string;
  btnProps?: ButtonProps;
}) => {
  const disclosureHistory = useDisclosure();
  const { t } = useTranslation();
  return (
    <Button
      variant="ghost"
      title={t('common.history')}
      borderRadius="50px"
      onClick={disclosureHistory.onOpen}
      {...props.btnProps}
    >
      <AiOutlineHistory />
      <ModalHistory
        disclosure={disclosureHistory}
        history={props}
      />
    </Button>
  );
};
