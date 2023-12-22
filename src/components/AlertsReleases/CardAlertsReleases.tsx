import { Box, Button, Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { CompanyContext } from 'context/Company/CompanyContext';
import { api } from 'hooks/useApi';
import { useContext } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { useTranslation } from 'react-i18next';
import { VscRefresh } from 'react-icons/vsc';
import { useQuery } from 'react-query';
import { DocumentGeneralAlert } from 'types/DocumentoGeralAlert';
import { CardAlertReleaseItem } from './CardAlertReleaseItem';

export const CardAlertsReleases = () => {
  const companyContext = useContext(CompanyContext);
  const { t } = useTranslation();
  const {
    data: alerts,
    refetch,
    isFetching,
  } = useQuery<DocumentGeneralAlert[]>(
    `alerts-documents-all-company-${companyContext.company?.id}`,
    async () =>
      (await api.get<DocumentGeneralAlert[]>('documents-alerts/list')).data.sort(
        (a, b) => a.prioridadeOrdem - b.prioridadeOrdem
      ),
    {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 1 * 5, // ms * s * m = 5min
    }
  );
  const x = alerts?.map((alert) => (
    <CardAlertReleaseItem
      key={alert.id}
      alert={alert}
    />
  ));
  return (
    <Card variant="elevated">
      <CardHeader pb={0}>
        <Text as={'b'}>{t('orthers.expirationAlert')}</Text>
        <Button
          mx={4}
          fontSize={'lg'}
          leftIcon={<VscRefresh />}
          variant={'ghost'}
          borderRadius={'full'}
          iconSpacing={0}
          isLoading={isFetching}
          onClick={() => refetch()}
        />
      </CardHeader>
      <CardBody
        pt={0}
        className="flex"
      >
        {(alerts?.length || 0) < 4 ? (
          <Box
            display={'flex'}
            gap={5}
            flexWrap={'wrap'}
          >
            {alerts?.map((alert) => (
              <CardAlertReleaseItem
                key={alert.id}
                alert={alert}
              />
            ))}
          </Box>
        ) : (
          <AliceCarousel
            mouseTracking
            infinite
            autoWidth
            items={alerts?.map((alert) => (
              <CardAlertReleaseItem
                key={alert.id}
                alert={alert}
              />
            ))}
          />
        )}
      </CardBody>
    </Card>
  );
};
