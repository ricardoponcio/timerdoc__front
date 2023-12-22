import { Button, Card, CardHeader, Progress, Spacer, Text } from '@chakra-ui/react';
import { ButtonHistory } from 'components/History/ButtonHistory';
import { api } from 'hooks/useApi';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbNote } from 'react-icons/tb';
import { useQuery } from 'react-query';
import { getDisplayPeriodicade, PeriodicidadeDocumento } from 'types/DocumentPeriodicity';
import { DocumentRelease } from 'types/DocumentRelease';
import { DocumentContext } from './DocumentContext';
import { FormReleaseDetail } from './FormReleaseDetail';
import { ReleasesNotes } from './ReleasesNotes';
import SkeletonDefault from './SkeletonDefault';

export default function CardReleaseDetail({
  id,
  className,
  keyBaseUrl,
  release: releaseDetail,
  setRelease,
  onUpdateSucess,
}: {
  id: number;
  className?: string;
  keyBaseUrl: string;
  release: DocumentRelease | null;
  setRelease: React.Dispatch<React.SetStateAction<DocumentRelease | null>>;
  onUpdateSucess: (release: DocumentRelease) => void;
}) {
  const { t } = useTranslation();
  const [showNotes, setShowNotes] = useState(false);
  const defaultCacheUrl = `${keyBaseUrl}/${releaseDetail?.id}`;
  const documentComtext = useContext(DocumentContext);

  const { data: release, isFetching } = useQuery<DocumentRelease>(
    defaultCacheUrl,
    async () => {
      const response = await api.get(`${defaultCacheUrl}/detail`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!releaseDetail?.id,
    }
  );
  const periodicidade = getDisplayPeriodicade(
    release?.competenciaReferencia.split('T')[0] || '',
    documentComtext.document?.periodicidade || PeriodicidadeDocumento.DIA
  );
  const btnProps = {
    size: 'lg',
    p: 3,
    fontSize: '24px',
    borderRadius: 50,
    isDisabled: !release,
  };
  return (
    <Card
      id="card-release-detail"
      key="card-release-detail"
      variant="elevated"
      colorScheme="teal"
      className={`${className}`}
      overflow={'clip'}
    >
      <CardHeader className="flex-a-center flex-between">
        <Button
          {...btnProps}
          fontSize="lg"
          p={2}
          colorScheme={'gray'}
          variant={'ghost'}
          onClick={() => setShowNotes(false)}
        >
          {t('common.detail')}
        </Button>
        <Button
          {...btnProps}
          colorScheme={showNotes ? 'yellow' : 'gray'}
          variant={showNotes ? 'solid' : 'ghost'}
          onClick={() => setShowNotes(true)}
        >
          <TbNote title={t('release.notesOfRelease')} />
        </Button>
        <ButtonHistory
          endPonint={`${defaultCacheUrl}/history`}
          titleHearder={`comp. ${periodicidade}`}
          btnProps={btnProps}
        />
        <Spacer />
        {isFetching && (
          <Progress
            size="xs"
            width={'50%'}
            isIndeterminate
          />
        )}
        {release && !isFetching && (
          <Text>
            <span className="text-bold">{t('release.lblCompetence')}: </span>
            {periodicidade}
          </Text>
        )}
      </CardHeader>
      {!release && <Text py={63}>{t('error.noSelect')}</Text>}
      {isFetching && !release && <SkeletonDefault />}
      {releaseDetail && !isFetching && release && !showNotes && (
        <FormReleaseDetail
          defaultCacheUrl={defaultCacheUrl}
          keyBaseUrl={keyBaseUrl}
          onUpdateSucess={onUpdateSucess}
          release={release}
          setRelease={setRelease}
        />
      )}
      {releaseDetail && !isFetching && release && showNotes && (
        <ReleasesNotes
          defaultCacheUrl={defaultCacheUrl}
          notes={release.observacoes}
        />
      )}
    </Card>
  );
}
