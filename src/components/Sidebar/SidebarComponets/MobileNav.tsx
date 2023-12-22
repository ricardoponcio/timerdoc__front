import { Flex, FlexProps, Image, useColorModeValue } from '@chakra-ui/react';
import timerDocLogo from '/timerdoc-logo.png';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="center"
      {...rest}
    >
      {/* <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      /> */}

      <Image
        src={timerDocLogo}
        maxH={'16'}
        objectFit="cover"
        alt="TimerDoc Logo"
      />
    </Flex>
  );
};

export default MobileNav;
