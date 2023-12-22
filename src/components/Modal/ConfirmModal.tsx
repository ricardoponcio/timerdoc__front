import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal(props: {
  continue: () => Promise<void>;
  message?: string;
  loading?: boolean;
  disClose: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
  const { t } = useTranslation();
  const continueAndClose = () => {
    props.continue().then(() => {
      props.disClose.onClose();
    });
  };

  return (
    <Modal
      isOpen={props.disClose.isOpen}
      onClose={props.disClose.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('common.confirmation')}</ModalHeader>
        <ModalBody>{props.message ? props.message : 'Deseja continuar?'}</ModalBody>

        <ModalFooter
          display="flex"
          justifyContent="space-around"
        >
          <Button
            colorScheme="blue"
            mr={3}
            onClick={props.disClose.onClose}
          >
            {t('common.no')}
          </Button>
          <Button
            isLoading={props.loading}
            variant="solid"
            colorScheme="whatsapp"
            onClick={continueAndClose}
          >
            {t('common.yes')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
