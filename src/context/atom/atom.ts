import { atom } from 'recoil';

export const baseWidthSideBar = atom<{ md: 24 | 60 }>({
  key: 'baseWidthSideBar',
  default: { md: 60 },
});

export const isOpenSidebar = atom({
  key: 'isOpenSidebar',
  default: true,
});

export const isDisableRecorrenciaPeriodicy = atom({
  key: 'isDisableRecorrenciaPeriodicy',
  default: false,
});
export const isDisableDocInicio = atom({
  key: 'isDisableDocInicio',
  default: false,
});

export const qtnInvitesPending = atom({
  key: 'qtnInvitesPending',
  default: 0,
});
