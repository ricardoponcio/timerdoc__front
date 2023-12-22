import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import './Login.sass';

export const LoginLayout = ({
  children,
  childrensImg,
  onClickImg,
}: {
  onClickImg?: () => void;
  childrensImg?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <Box
      id="login"
      className="loading-background-color"
    >
      <Box
        className="login-image"
        onClick={onClickImg}
      >
        {childrensImg}
      </Box>
      <Box
        className="login-card no-over"
        css={{ maxHeight: '100vh' }}
      >
        {children}
      </Box>
    </Box>
  );
};
