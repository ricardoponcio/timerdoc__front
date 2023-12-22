import { Box, Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { ChangeLanguage } from 'components/I18n/ChangeLanguage';
import { AuthContext } from 'context/Auth/AuthContext';
import { Squash as Hamburger } from 'hamburger-react';
import { useSetWidthBase, useSideBarOnOpen } from 'hooks/state/useSyles';
import { ModalUserEdit } from 'pages/User/ModalUserEdit';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Company } from 'types/Empresa';
import './Topbar.sass';

export const Topbar = () => {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpenSidebar, setOpenSidebar] = useSideBarOnOpen();
  const setMdSidebar = useSetWidthBase();
  const { t } = useTranslation();

  const onHamburgerClick = () => {
    setMdSidebar({ md: !isOpenSidebar ? 60 : 24 });
    setOpenSidebar(!isOpenSidebar);
  };
  const logout = () => {
    queryClient.removeQueries();
    auth.singout();
    navigate('/login', { replace: true });
  };

  const company: Company | null =
    auth.company || JSON.parse(localStorage.getItem('companyData') || '{}');
  return (
    <div id="topbar">
      <Hamburger
        onToggle={onHamburgerClick}
        toggled={isOpenSidebar}
        duration={0.8}
      />
      <ModalUserEdit
        isOpen={isOpen}
        onClose={onClose}
      />
      <Box flex={'1'} />
      <ChangeLanguage />
      <Menu>
        <MenuButton
          className="infos-user"
          as={Button}
          variant={'ghost'}
          height="80%"
          rightIcon={<IoChevronDownCircleOutline />}
        >
          <p>{auth.user?.nome}</p>
          <p>{company?.razaoSocial}</p>
        </MenuButton>
        <MenuList>
          {company?.id ? (
            <MenuItem
              as={Link}
              to={`/companys/${company.id}`}
            >
              {company.razaoSocial}
            </MenuItem>
          ) : (
            <MenuItem
              as={Link}
              to={'/companys'}
              replace={true}
            >
              {t('company.selectOne')}
            </MenuItem>
          )}
          <MenuItem
            as={Link}
            to={'/invites'}
          >
            {t('invite.me')}
          </MenuItem>
          <MenuItem onClick={onOpen}>{t('common.myAccount')}</MenuItem>
          <MenuItem onClick={logout}>{t('actions.logout')}</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
