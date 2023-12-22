import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { HelpUsageBtn } from 'components/UserHelper/HelpUsageBtn';
import { AuthContext } from 'context/Auth/AuthContext';
import { api } from 'hooks/useApi';
import { AccordionInvite } from 'pages/Invites/components/AccordionInvite';
import { AccordionListInvitesCompany } from 'pages/Invites/components/AccordionListInvitesCompany';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { UserCompany } from 'types/User';
import { CardCompanyUsers } from './CardCompanyUsers';

export const CompanyUsers = () => {
  const onInvite = useDisclosure();
  const { t } = useTranslation();
  const onShowInvite = useDisclosure();
  const auth = useContext(AuthContext);
  const company = auth.getCompany();
  const { data: users } = useQuery<UserCompany[]>(
    `/users/list_company_${company?.id}`,
    async () => (await api.get<UserCompany[]>('/users/list')).data,
    { refetchOnWindowFocus: false }
  );
  const companyName = (company?.fantasia?.concat(' - ') || '') + company?.razaoSocial;
  return (
    <Card className="InvitePage">
      <CardHeader>
        <Text
          as={'h3'}
          my="auto"
          flex={1}
        >
          {t('common.lblUsersOf', {
            companyName: companyName,
          })}
          <HelpUsageBtn
            title={t('invite.me')}
            ml={6}
            fontSize={24}
          >
            {t('common.aboutUserCompany', { companyName: companyName })}
          </HelpUsageBtn>
        </Text>
        <Button
          mx={3}
          onClick={onInvite.onToggle}
          isDisabled={!company?.id}
        >
          {t('invite.inviteToCompany')}
        </Button>
        <Button
          onClick={onShowInvite.onToggle}
          isDisabled={!company?.id}
        >
          {t('invite.seeInvitations')}
        </Button>
      </CardHeader>
      <AccordionInvite active={onInvite.isOpen} />
      <AccordionListInvitesCompany active={onShowInvite.isOpen} />
      <CardBody>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-around'}
        >
          {users?.map((u) => (
            <CardCompanyUsers
              key={u.usuario.email}
              user={u}
            />
          ))}
        </Flex>
        <Divider />
      </CardBody>
    </Card>
  );
};
