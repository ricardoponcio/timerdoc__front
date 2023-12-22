import { Button, Td, Tr } from '@chakra-ui/react';
import { api } from 'hooks/useApi';
import { useBtnProps } from 'hooks/useButton';
import moment from 'moment';
import { keyCompanyChoice } from 'pages/Company/CompanyChoice/CompanyChoice';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { maskFormaterCnpj } from 'services/ObjectsUtils';
import { Invite } from 'types/Invite';

export const TableTrInvite = ({ invite }: { invite: Invite }) => {
  const { t } = useTranslation();
  const [btnAccept, setBtnAccept] = useBtnProps();
  const [btnRecuse, setBtnRecuse] = useBtnProps();
  const queryClient = useQueryClient();
  const disableBtns = () => {
    setBtnAccept((btn) => ({ ...btn, isDisabled: true }));
    setBtnRecuse((btn) => ({ ...btn, isDisabled: true }));
  };
  const accept = async (inviteId: number) => {
    disableBtns();
    await api.post(`user/accept-invite/${inviteId}`);
    setBtnAccept({ ...btnAccept, isLoading: false });
    queryClient.refetchQueries({ queryKey: keyCompanyChoice });
  };
  const recuse = async (inviteId: number) => {
    disableBtns();
    await api.post(`user/decline-invite/${inviteId}`);
    setBtnRecuse({ ...btnRecuse, isLoading: false });
    queryClient.refetchQueries({ queryKey: keyCompanyChoice });
  };
  return (
    <Tr>
      <Td title={moment(invite.dataCriacao).format('LLL')}>
        {moment(invite.dataCriacao).format('L')}
      </Td>
      <Td>
        <a href={`mailto:${invite.usuarioOrigem.email}`}>
          {`${invite.usuarioOrigem.nome} <${invite.usuarioOrigem.email}>`}
        </a>
      </Td>
      <Td title={`CNPJ: ${maskFormaterCnpj(invite.empresaConvite.cnpj)}`}>
        {invite.empresaConvite.fantasia?.concat(' / ')}
        {invite.empresaConvite.razaoSocial}
      </Td>
      <Td
        display={'flex'}
        justifyContent={'space-around'}
      >
        <Button
          {...btnAccept}
          onClick={() => accept(invite.id)}
          size={'sm'}
          colorScheme={'green'}
        >
          {t('actions.accept')}
        </Button>
        <Button
          {...btnRecuse}
          onClick={() => recuse(invite.id)}
          size={'sm'}
          colorScheme={'red'}
        >
          {t('actions.recuse')}
        </Button>
      </Td>
    </Tr>
  );
};
