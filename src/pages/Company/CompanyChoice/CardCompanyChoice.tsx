import { Avatar, Box, Card, CardBody, Heading, Text, useDisclosure } from '@chakra-ui/react';
import ConfirmModal from 'components/Modal/ConfirmModal';
import { AuthContext } from 'context/Auth/AuthContext';
import { api } from 'hooks/useApi';
import { useContext } from 'react';
import { MdExitToApp } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { maskFormaterCnpj } from 'services/ObjectsUtils';
import { CompanyRole } from 'types/CompanyTypes';
import { Company } from 'types/Empresa';
import { keyCompanyChoice } from './CompanyChoice';
import timerDocIcon from '/timerdoc-icon.svg';

export const CardCompanyChoice = ({
  company,
  allCompanys,
}: {
  company: Company;
  allCompanys?: Company[];
}) => {
  const disclosure = useDisclosure();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleSelectCompany = async () => {
    await auth.selectCompany(company.id, allCompanys);

    navigate('/');
  };
  const handleAbandonRelation = async () => {
    api.post(`/user/abandon-relation/${company.id}`).then(() => {
      const companysRoles = queryClient.getQueryData<CompanyRole[]>(keyCompanyChoice);
      if (companysRoles)
        queryClient.setQueryData(
          keyCompanyChoice,
          companysRoles.filter((c) => company.id !== c.empresa.id)
        );
    });
  };
  return (
    <Card
      className="card-company"
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      margin={1}
    >
      <Box>
        <MdExitToApp
          className="decline_company"
          onClick={disclosure.onOpen}
        />
        <ConfirmModal
          continue={handleAbandonRelation}
          disClose={disclosure}
          message={`Abandonar relação com ${company.razaoSocial}${
            company.fantasia ? ' - ' + company.fantasia : ''
          }?`}
        />
      </Box>
      <Avatar
        onClick={handleSelectCompany}
        my={2}
        ml={2}
        size={'xl'}
        name={'Empresa Logo'}
        src={timerDocIcon}
      />
      <CardBody onClick={handleSelectCompany}>
        <Heading size="sm">
          {company.razaoSocial} {company.fantasia && <span>&middot;&nbsp;{company.fantasia}</span>}
        </Heading>
        <Text>
          <Text as={'b'}>CNPJ: </Text>
          {maskFormaterCnpj(company.cnpj)}
        </Text>
      </CardBody>
    </Card>
  );
};
