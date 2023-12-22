import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { api } from 'hooks/useApi';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { ChangeHistory } from 'types/ChangeHistory';

export const ModalHistory = ({
  disclosure,
  history,
}: {
  disclosure: { isOpen: boolean; onOpen: () => void; onClose: () => void };
  history: { endPonint: string; titleHearder?: string };
}) => {
  const { t } = useTranslation();
  const { data: changeHistory } = useQuery<ChangeHistory[]>(
    `history_${history.endPonint}`,
    async () =>
      (await api.get<ChangeHistory[]>(history.endPonint)).data.sort(
        (a, b) => -a.date.localeCompare(b.date)
      ),
    { enabled: disclosure.isOpen }
  );
  const displayValueOrDate = (str: string): string => {
    const mDt = moment(str, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', true);
    if (mDt.isValid()) return mDt.format('L LTS').replace(' 00:00:00', '');
    return str;
  };

  return (
    <Modal
      size={'6xl'}
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      scrollBehavior={'outside'}
      motionPreset={'slideInBottom'}
    >
      <ModalOverlay backdropFilter="blur(2px) hue-rotate(90deg)" />
      <ModalContent>
        <ModalHeader>{t('common.history').concat(' ' + history.titleHearder)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table
              size="sm"
              variant="striped"
              colorScheme="gray"
            >
              <Thead>
                <Tr>
                  <Th>Data</Th>
                  <Th>Tipo</Th>
                  <Th>Alterado por</Th>
                  <Th>Alterações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {changeHistory?.map((ch) => (
                  <Tr key={ch.date.toString()}>
                    <Td>{moment(ch.date).format('L LTS')}</Td>
                    <Td>{ch.changeType.description}</Td>
                    <Td title={`${ch.changedBy.nome} <${ch.changedBy.email}>`}>
                      {ch.changedBy.nome}
                    </Td>
                    <Td>
                      {ch.changes.map((cv, i) => (
                        <Box key={i}>
                          <Text as={'b'}>
                            {i % 2 === 1 && <br />}
                            {cv.attribute}
                          </Text>
                          {' | '}
                          <Text as={'span'}>
                            De: {displayValueOrDate(cv.previousValue)} Para:{' '}
                            {displayValueOrDate(cv.newValue)}
                          </Text>
                        </Box>
                      ))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button onClick={disclosure.onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
