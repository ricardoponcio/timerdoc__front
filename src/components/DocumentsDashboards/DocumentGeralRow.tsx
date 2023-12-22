import { Button, Spinner, Td, Tr, useDisclosure } from '@chakra-ui/react';
import moment from 'moment';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { VscDebugStart } from 'react-icons/vsc';
import { useQueryClient } from 'react-query';
import { CompanyContext } from '../../context/Company/CompanyContext';
import { api } from '../../hooks/useApi';
import { DocumentRelease } from '../../types/DocumentRelease';
import { DocumentGeneral } from '../../types/Documets';
import ConfirmModal from '../Modal/ConfirmModal';
import DocumentReleaseCreateModal from '../Modal/DocumentReleaseCreateModal';

function DocumentGeralRow({
  document,
  onClickDocument,
}: {
  document: DocumentGeneral;
  onClickDocument: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalRelease, setShowModalRelease] = useState(false);
  const disclosure = useDisclosure();
  const com = useContext(CompanyContext);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const handleExclusao = async (): Promise<void> => {
    setLoading(true);
    await api.delete(`/documents/${document.id}/remove`);

    queryClient.invalidateQueries({ queryKey: `documents-${com.company?.id}` });
    setLoading(false);
  };
  const clickable = {
    onClick: onClickDocument,
    cursor: 'pointer',
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  const handleAddRelease = (release: DocumentRelease) => {};
  return (
    <Tr
      _hover={{
        transition: '0.2s',
        background: 'teal.100',
      }}
    >
      <Td {...clickable}>
        <div></div>
        {loading && <Spinner />}
        {document.nome}
      </Td>
      <Td {...clickable}>{moment(document.inicioContagem).format('L')}</Td>
      <Td {...clickable}>
        {document.fimContagem ? moment(document.fimContagem).format('L') : 'N/A'}
      </Td>
      <Td
        {...clickable}
        isNumeric
      >
        {document.valorPadrao}
      </Td>
      <Td {...clickable}>{t('error.noRegister')}</Td>
      <Td>
        <Button
          title={t('document.newRelease')}
          colorScheme="cyan"
          variant="ghost"
          borderRadius="50%"
          padding={0}
          onClick={() => setShowModalRelease(true)}
        >
          <VscDebugStart size="1.5em" />
          <DocumentReleaseCreateModal
            idDoc={document.id}
            modalOpen={setShowModalRelease}
            state={showModalRelease}
            onSucess={handleAddRelease}
            dates={{ inicioContagem: document.inicioContagem, fimContagem: document.fimContagem }}
            periodicity={document.periodicidade}
            repeat={document.recorrencia}
          />
        </Button>
        <Button
          title={t('document.cancel')}
          colorScheme="red"
          variant="ghost"
          borderRadius="50%"
          padding={0}
          onClick={disclosure.onOpen}
        >
          <RiDeleteBack2Line />
          <ConfirmModal
            message={t('document.confirmCancelDocument', { name: document.nome })}
            continue={() => handleExclusao()}
            disClose={disclosure}
            loading={loading}
          />
        </Button>
      </Td>
    </Tr>
  );
}

export default DocumentGeralRow;
