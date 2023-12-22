import { Flex, Link, Progress } from '@chakra-ui/react';
import { CompanyContext } from 'context/Company/CompanyContext';
import { api } from 'hooks/useApi';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useFilesize } from 'services/ObjectsUtils';
interface IUsagedStore {
  used: number;
  usedMetric: 'B' | 'MB';
  maxUsage: number;
  maxUsageMetric: 'B' | 'MB';
  usage: string;
}
const UsageStoreNav = () => {
  const companyContext = useContext(CompanyContext);
  const { t } = useTranslation();
  const { data: usageCompany } = useQuery<IUsagedStore>(
    `company-usage-store-${companyContext.company?.id}`,
    async () => (await api.get<IUsagedStore>('logged-company/storage-used')).data
  );
  const usadoPercentage = Number(usageCompany?.usage.replace('%', ''));
  return (
    <Link
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {usageCompany && (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="help"
          __css={{
            color: 'white',
          }}
          title={t('storage.usedAndTotal', {
            used: useFilesize(usageCompany.used),
            total: useFilesize(usageCompany.maxUsage),
          })}
        >
          {t('storage.usage')} {usageCompany.usage}
          <Progress
            max={usageCompany.maxUsage}
            value={usageCompany.used}
            size="md"
            bgColor={'#968A87'}
            hasStripe
            colorScheme={
              usadoPercentage < 90 ? 'linkedin' : usadoPercentage < 95 ? 'orange' : 'red'
            }
          />
        </Flex>
      )}
    </Link>
  );
};

export default UsageStoreNav;
