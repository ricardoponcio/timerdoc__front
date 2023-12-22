import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import DocumentModal from 'components/Modal/DocumentModal';
import { CompanyContext } from 'context/Company/CompanyContext';
import { api } from 'hooks/useApi';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { DocumentGeneral } from 'types/Documets';
import DocumentGeralRow from './DocumentGeralRow';

// eslint-disable-next-line no-var
export var keyDataCacheDocuments: string;

export const CardTableDocuments = () => {
  const com = useContext(CompanyContext);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  keyDataCacheDocuments = `documents-${com.company?.id}`;
  const { data: documets, isFetching } = useQuery<DocumentGeneral[]>(
    keyDataCacheDocuments,
    async () => {
      const response = await api.get('documents/list');
      return response.data;
    },
    {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60, // 60s
    }
  );

  const handleDetailsDocument = (idDoc: number) => navigate(`/document/${idDoc}`);

  const handleRefreshDataDocuments = async (newDoc: DocumentGeneral) => {
    const prevDocs = queryClient.getQueryData<DocumentGeneral[]>(`documents-${com.company?.id}`);

    prevDocs?.push(newDoc);

    queryClient.setQueryData(`documents-${com.company?.id}`, prevDocs);
  };
  return (
    <Card variant="elevated">
      <CardHeader pb={0}>
        <Button
          colorScheme="blue"
          onClick={() => setShowModal(true)}
        >
          {t('document.newDocument')}
        </Button>
        <DocumentModal
          state={showModal}
          modalState={setShowModal}
          onSucess={handleRefreshDataDocuments}
        ></DocumentModal>
      </CardHeader>
      <CardBody css={{ display: 'flex', justifyContent: 'center' }}>
        {isFetching && <Spinner size="xl" />}
        {!isFetching && (
          <Table>
            <Thead>
              <Tr textTransform={'capitalize'}>
                <Th>{t('common.name')}</Th>
                <Th>{t('document.start')}</Th>
                <Th>{t('document.end')}</Th>
                <Th isNumeric>{t('document.valueDefault')}</Th>
                <Th>{t('document.nextDueDate')}</Th>
                <Th>#</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documets &&
                documets.map((doc) => (
                  <DocumentGeralRow
                    key={doc.id}
                    document={doc}
                    onClickDocument={() => handleDetailsDocument(doc.id)}
                  />
                ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};
