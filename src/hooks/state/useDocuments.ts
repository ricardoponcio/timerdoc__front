import {
  isDisableDocInicio,
  isDisableRecorrenciaPeriodicy,
  qtnInvitesPending,
} from 'context/atom/atom';
import { useRecoilState } from 'recoil';

export const useDisableRecorrencia = () => useRecoilState(isDisableRecorrenciaPeriodicy);
export const useDisableDocInicio = () => useRecoilState(isDisableDocInicio);
export const useQtnInvitesPending = () => useRecoilState(qtnInvitesPending);
