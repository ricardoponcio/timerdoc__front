import { Table, TableCaption, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useInvites } from 'hooks/useInvites';
import { useTranslation } from 'react-i18next';
import { TableTrInvite } from './TableTrInvite';

export const TableInvites = () => {
  const { t } = useTranslation();
  const { data: invites } = useInvites();
  const empty = invites?.length === 0;
  return (
    <Table>
      <Thead hidden={empty}>
        <Tr>
          <Th>{t('invite.lblDate')}</Th>
          <Th>{t('invite.lblSender')}</Th>
          <Th>{t('common.lblCompany')}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody className="body-table-invite">
        {invites?.map((invite) => (
          <TableTrInvite
            key={invite.id}
            invite={invite}
          />
        ))}
      </Tbody>
      <TableCaption hidden={!empty}>{t('invite.noInvitesPending')}</TableCaption>
    </Table>
  );
};
