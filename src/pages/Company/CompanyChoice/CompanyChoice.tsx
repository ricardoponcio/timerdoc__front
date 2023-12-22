import { Box, Button, Flex, Heading, Spinner, useDisclosure } from '@chakra-ui/react';
import { ButtonBadge } from 'components/Button/ButtonBadge';
import { AuthContext } from 'context/Auth/AuthContext';
import { useQtnInvitesPending } from 'hooks/state/useDocuments';
import { api } from 'hooks/useApi';
import { useInvites } from 'hooks/useInvites';
import { ModalInvite } from 'pages/Invites/ModalInvite';
import { ModalUserEdit } from 'pages/User/ModalUserEdit';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BiEnvelope, BiMessageSquareAdd } from 'react-icons/bi';
import { MdExitToApp } from 'react-icons/md';
import { RiUser3Fill } from 'react-icons/ri';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { CompanyRole } from 'types/CompanyTypes';
import '../Company.sass';
import { CardCompanyChoice } from './CardCompanyChoice';
import { NoRegisteredCompany } from './NoRegisteredCompany';

// esse cara que ta fazendo o `hmr invalidate`, depois jogar todas as chaves de cache em um arquivo separado ts que não ira mais gerar o warn
export const keyCompanyChoice = 'company_choice';

export const CompanyChoice = () => {
  const { t } = useTranslation();
  const disUserEdit = useDisclosure();
  const disInvites = useDisclosure();
  const [invitesPending] = useQtnInvitesPending();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  useInvites();

  const { data: companys, isFetching: loading } = useQuery<CompanyRole[]>(
    keyCompanyChoice,
    async () => (await api.get<CompanyRole[]>('company/list')).data,
    { onSuccess: (companys) => localStorage.setItem('listCompanys', JSON.stringify(companys)) }
  );
  const baseButtons = {
    borderRadius: 24,
    colorScheme: 'cyan',
    variant: 'ghost',
  };

  return (
    <div className="container-company">
      <Flex
        id="header_choice_company"
        className="container-max"
      >
        <Button
          {...baseButtons}
          onClick={() => navigate('/companys/add')}
        >
          <BiMessageSquareAdd size={24} />
        </Button>
        <Button
          onClick={disUserEdit.onOpen}
          {...baseButtons}
        >
          <RiUser3Fill size={24} />
          <ModalUserEdit
            isOpen={disUserEdit.isOpen}
            onClose={disUserEdit.onClose}
          />
        </Button>
        <ButtonBadge
          baseButtons={baseButtons}
          valueBadge={invitesPending}
          onClick={disInvites.onOpen}
          noValue={'hidden'}
        >
          <BiEnvelope />
          <ModalInvite disclosure={disInvites} />
        </ButtonBadge>
        <Button
          {...baseButtons}
          onClick={auth.singout}
        >
          <MdExitToApp size={24} />
        </Button>
      </Flex>
      {(companys?.length || 0) > 0 && (
        <Heading
          textAlign={'center'}
          size={'lg'}
          mb={'5'}
        >
          {t('company.selectContinue')}
        </Heading>
      )}
      <Box className="container-max cards-companys">
        {companys?.map((com) => (
          <CardCompanyChoice
            key={com.empresa.id}
            company={com.empresa}
            allCompanys={companys.map((c) => c.empresa)}
          />
        ))}
        {loading && companys?.length !== 0 && (
          <Box className="loading-companys-choice">
            <Spinner
              color="red.500"
              size="xl"
              boxSize={24}
              thickness="4px"
            />
          </Box>
        )}
        {companys?.length === 0 && (
          <Box className="loading-companys-choice">
            <NoRegisteredCompany />
          </Box>
        )}
      </Box>
    </div>
  );
};
