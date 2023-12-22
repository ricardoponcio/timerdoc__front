import { baseWidthSideBar, isOpenSidebar } from 'context/atom/atom';
import { useRecoilState, useRecoilValue } from 'recoil';

export const useWidthBase = () => useRecoilValue(baseWidthSideBar);
export const useSetWidthBase = () => useRecoilState(baseWidthSideBar)[1];
export const useSideBarOnOpen = () => useRecoilState(isOpenSidebar);
