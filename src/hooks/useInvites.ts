import { useQuery } from 'react-query';
import { Invite } from 'types/Invite';
import { useQtnInvitesPending } from './state/useDocuments';
import { api } from './useApi';

export const useInvites = () => {
  const [, setInvitesPendents] = useQtnInvitesPending();
  return useQuery<Invite[]>(
    'invites_user',
    async () => (await api.get<Invite[]>('user/open-invites/list')).data,
    { onSuccess: (invites) => setInvitesPendents(invites.length) }
  );
};
