import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useWidthBase } from 'hooks/state/useSyles';
import { ReactNode } from 'react';
import './Sidebar.sass';
import MobileNav from './SidebarComponets/MobileNav';
import SidebarContent from './SidebarComponets/SidebarContent';

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const widthBase = useWidthBase();
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        display={{ base: 'flex', md: 'none' }}
        onOpen={onOpen}
      />
      <Box ml={{ base: 0, ...widthBase }}>{children}</Box>
    </Box>
  );
}
