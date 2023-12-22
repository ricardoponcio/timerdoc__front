import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { AuthContext } from 'context/Auth/AuthContext';
import { api } from 'hooks/useApi';
import moment from 'moment';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { InviteDto } from 'types/Invite';

const RowInvite = ({ invite, keyCache }: { invite: InviteDto; keyCache: string }) => {
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const queryClient = useQueryClient();
  const handleRevokeInvate = async () => {
    setLoadingBtn(true);
    await api.delete(`/users/invite/${invite.id}/cancel`);
    const invites = queryClient.getQueryData<InviteDto[]>(keyCache);
    if (invites)
      queryClient.setQueryData<InviteDto[]>(
        keyCache,
        invites.filter((ivt) => ivt.id !== invite.id)
      );
    setTimeout(() => setLoadingBtn(false), 3000);
  };
  return (
    <Tr>
      <Td>{moment(invite.dataCriacao).format('L LTS')}</Td>
      <Td>{`${invite.nomeConvidado} <${invite.emailConvidado}>`}</Td>
      <Td>{invite.role.nome}</Td>
      <Td>
        <Button
          isLoading={loadingBtn}
          colorScheme={'red'}
          onClick={handleRevokeInvate}
        >
          {t('invite.revokeinvitation')}
        </Button>
      </Td>
    </Tr>
  );
};

export const AccordionListInvitesCompany = (props: { active: boolean }) => {
  const auth = useContext(AuthContext);
  const { t } = useTranslation();
  const keyCache = `/users/open-invites/list_company_${auth.getCompany()?.id}`;
  const { data: invites, isLoading } = useQuery<InviteDto[]>(
    keyCache,
    async () => (await api.get<InviteDto[]>('/users/open-invites/list')).data,
    { enabled: props.active }
  );

  return (
    <Accordion
      index={props.active ? [0] : undefined}
      allowMultiple
    >
      <AccordionItem
        borderTop={0}
        borderBottom={!props.active ? 0 : undefined}
      >
        <AccordionButton css={{ display: 'none' }} />
        <AccordionPanel pb={4}>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>{t('invite.guestAt')}</Th>
                  <Th>{t('common.for')}</Th>
                  <Th>{t('common.lblUserProfile')}</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {invites?.map((invite) => (
                  <RowInvite
                    key={invite.id}
                    invite={invite}
                    keyCache={keyCache}
                  />
                ))}
                {!invites && isLoading && <Spinner />}
              </Tbody>
            </Table>
          </TableContainer>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
