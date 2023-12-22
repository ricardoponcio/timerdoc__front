import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { TableInvites } from './components/TableInvites';

export const ModalInvite = ({
  disclosure,
}: {
  disclosure: { isOpen: boolean; onClose: () => void };
}) => {
  const { isOpen, onClose } = disclosure;
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'6xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('invite.me')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableInvites />
        </ModalBody>

        {/* <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};
