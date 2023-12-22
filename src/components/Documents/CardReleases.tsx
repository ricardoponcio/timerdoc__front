import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useDisableDocInicio, useDisableRecorrencia } from 'hooks/state/useDocuments';
import moment from 'moment';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscDebugStart } from 'react-icons/vsc';
import { useQuery, useQueryClient } from 'react-query';
import { getDisplayPeriodicade, PeriodicidadeDocumento } from 'types/DocumentPeriodicity';
import { api } from '../../hooks/useApi';
import { DocumentRelease } from '../../types/DocumentRelease';
import DocumentReleaseCreateModal from '../Modal/DocumentReleaseCreateModal';
import { DocumentContext } from './DocumentContext';

export default function CardReleases({
  id,
  release,
  keyBaseUrl,
  setRelease,
}: {
  id: number;
  keyBaseUrl: string;
  release: DocumentRelease | null;
  setRelease: React.Dispatch<React.SetStateAction<DocumentRelease | null>>;
}) {
  const { t } = useTranslation();
  const [showModalRelease, setShowModalRelease] = useState(false);
  const [, setDisable] = useDisableRecorrencia();
  const [, setDisableInicio] = useDisableDocInicio();
  const documentComtext = useContext(DocumentContext);
  const queryClient = useQueryClient();

  const { data: releases, isFetching } = useQuery<DocumentRelease[]>(
    keyBaseUrl,
    async () => (await api.get<DocumentRelease[]>(`${keyBaseUrl}/list`)).data,
    {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60, // 60s
      onSuccess: (rels) => {
        setDisable(rels.length > 1);
        setDisableInicio(rels.length > 0);
      },
    }
  );
  // abaixo filtro para selecionar uma release
  // if (!release && releases && !isFetching && releases.filter(rel => rel.situacao === SituacaoRelease.INICIADO)){
  //   const list = releases.filter(rel => rel.situacao === SituacaoRelease.INICIADO);
  //   if (!!list.length) setRelease(list[0]);
  //   if (!!releases.length) setRelease(releases[0]);
  // }
  const handleAddRelease = (release: DocumentRelease) => {
    const rel = queryClient.getQueryData<DocumentRelease[]>(keyBaseUrl);
    rel?.push(release);
    queryClient.setQueryData(keyBaseUrl, rel);
  };

  return (
    <Card
      id="card-doc-releses"
      key="card-doc-releses"
      variant="elevated"
      colorScheme="teal"
    >
      <CardHeader className="flex-a-center">
        <Heading
          size="md"
          className="card-heading"
        >
          {t('release.lblRelease')}
        </Heading>
        <Button
          hidden={isFetching && !releases}
          title={t('document.newRelease')}
          colorScheme="teal"
          variant="outline"
          borderRadius="full"
          onClick={() => setShowModalRelease(true)}
        >
          {t('document.newRelease')}
          <VscDebugStart size="1.5em" />
          <DocumentReleaseCreateModal
            idDoc={id}
            modalOpen={setShowModalRelease}
            state={showModalRelease}
            onSucess={handleAddRelease}
            dates={{ inicioContagem: new Date(), fimContagem: new Date() }}
          />
        </Button>
        {isFetching && (
          <Progress
            size="xs"
            flex={'1'}
            ml={'2'}
            // width={'10%'}
            isIndeterminate
          />
        )}
      </CardHeader>
      <CardBody
        overflow={'auto'}
        py={0}
      >
        <Table
          variant="striped"
          colorScheme="teal"
        >
          <TableCaption>{t('release.releasesInDocument')}</TableCaption>
          <Thead>
            <Tr>
              <Th>{t('common.createdAt')}</Th>
              <Th>{t('release.lblCompetence')}</Th>
              <Th>{t('common.situation')}</Th>
              <Th>{t('release.lblDelivery')}</Th>
              <Th>{t('release.lblTerm')}</Th>
              <Th>{t('document.lblDescription')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {releases?.map((rel) => (
              <Tr
                key={rel.id}
                className={`tr-releases${rel.id === release?.id ? ' select' : ''}`}
                onClick={() => setRelease(rel)}
              >
                <Td>{moment(rel.dataCriacao).format('L LTS')}</Td>
                <Td>
                  {getDisplayPeriodicade(
                    rel.competenciaReferencia.split('T')[0],
                    documentComtext.document?.periodicidade || PeriodicidadeDocumento.DIA
                  )}
                </Td>
                <Td>{t('situation.' + rel.situacao.toString())}</Td>
                <Td>{moment(rel.entrega).format('L')}</Td>
                <Td>{moment(rel.prazo).format('L')}</Td>
                <Td>
                  <Text
                    noOfLines={[1, 2]}
                    title={rel.descricao}
                  >
                    {rel.descricao}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>{t('common.createdAt')}</Th>
              <Th>{t('release.lblCompetence')}</Th>
              <Th>{t('common.situation')}</Th>
              <Th>{t('release.lblDelivery')}</Th>
              <Th>{t('release.lblTerm')}</Th>
              <Th>{t('document.lblDescription')}</Th>
            </Tr>
          </Tfoot>
        </Table>
      </CardBody>
    </Card>
  );
}
