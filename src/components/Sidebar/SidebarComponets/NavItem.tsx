import { Box, Flex, FlexProps, Icon } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: ReactNode;
  select?: boolean;
}
const NavItem = ({ icon, children, select, ...rest }: NavItemProps) => {
  const selected = { bg: 'yellow.500', color: 'white' };
  return (
    <Box
      // href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        // nao é a melhor abordagem , pois esta alterando alguns estilos interno do metodos
        // mas esta funcional
        __css={select ? selected : undefined}
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            // h={'50px'}
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export default NavItem;
