import {
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { AuthContext } from 'context/Auth/AuthContext';
import { CompanyContext } from 'context/Company/CompanyContext';
import { useSideBarOnOpen, useWidthBase } from 'hooks/state/useSyles';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FiHome, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import UsageStoreNav from './UsageStore/UsageStoreNav';
import timerDocIcon from '/timerdoc-icon.svg';
import timerDocLogo from '/timerdoc-logo.png';
interface SidebarProps extends BoxProps {
  onClose: () => void;
}
// interface LinkItemProps {
//   name: string;
//   icon: IconType;
// }

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  //   const LinkItems: Array<LinkItemProps> = [
  //     { name: 'Home', icon: FiHome },
  //     { name: 'Trending', icon: FiTrendingUp },
  //     { name: 'Explore', icon: FiCompass },
  //     { name: 'Favourites', icon: FiStar },
  //     { name: 'Settings', icon: FiSettings },
  //   ];
  const { t } = useTranslation();
  const compCtx = useContext(CompanyContext);
  const auth = useContext(AuthContext);
  const empresas = auth.getCompanys();
  const widthBase = useWidthBase();
  const [openSidebar] = useSideBarOnOpen();
  const navigate = useNavigate();
  const handleSelectCompany = (id: number) => {
    auth.selectCompany(id);
    navigate('/');
  };
  return (
    <Box
      as={'nav'}
      bg={useColorModeValue('gray', 'gray.100')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', ...widthBase }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        {/* <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          onClick={onClose}
        >
          Logo
        </Text> */}
        <Image
          src={openSidebar ? timerDocLogo : timerDocIcon}
          objectFit="cover"
          alt="TimerDoc Logo"
          cursor={'pointer'}
          onClick={() => navigate('/')}
        />
        <CloseButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
        />
      </Flex>
      {empresas?.map((empresa) => (
        <NavItem
          key={empresa.id}
          icon={FiHome}
          select={empresa.id == compCtx.company?.id}
          onClick={() => handleSelectCompany(empresa.id)}
        >
          {openSidebar && (
            <>
              {empresa.fantasia?.concat(' - ')}
              {empresa.razaoSocial}
            </>
          )}
        </NavItem>
      ))}
      <Divider my={2} />
      <NavItem
        icon={FiUsers}
        // select={empresa.id == compCtx.company?.id}
        onClick={() => navigate('/users')}
      >
        {openSidebar && <>{t('common.lblUsers')}</>}
      </NavItem>
      {openSidebar && <UsageStoreNav />}
    </Box>
  );
};

export default SidebarContent;
