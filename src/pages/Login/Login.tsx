import { Box, Card, CardBody, SlideFade, useDisclosure } from '@chakra-ui/react';
import { ChangeLanguage } from 'components/I18n/ChangeLanguage';
import CardTagsVersion from 'components/TagsVersion/CardTagsVersion';
import { useEffect, useState } from 'react';
import { CardCreateAccounnt } from './LoginCards/CardCreateAccounnt';
import { CardForgotPassword } from './LoginCards/CardForgotPassword';
import { CardLoginAcess } from './LoginCards/CardLoginAcess';
import { LoginLayout } from './LoginLayout';

export const Login = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: displayForgotPassword, onToggle: onDisplayForgotPassword } = useDisclosure();
  const [displayVersion, setDisplayVersion] = useState(false);
  const defaultPropsSlide = {
    unmountOnExit: true,
    className: 'content-100 flex-center',
  };

  useEffect(() => {
    if (import.meta.env.VERSION !== 'prod') setDisplayVersion(true);
  }, []);

  const displayTags = () => setTimeout(() => setDisplayVersion(!displayVersion), 1000);
  return (
    <LoginLayout
      onClickImg={displayTags}
      childrensImg={
        <>
          {displayVersion && (
            <Card
              as={'section'}
              size={'sm'}
              variant={'filled'}
            >
              <CardBody>
                <CardTagsVersion />
              </CardBody>
            </Card>
          )}
        </>
      }
    >
      <SlideFade
        in={!isOpen}
        offsetY={'-50px'}
        {...defaultPropsSlide}
      >
        {displayForgotPassword ? (
          <CardForgotPassword forgotPassword={onDisplayForgotPassword} />
        ) : (
          <CardLoginAcess
            createAccount={onToggle}
            forgotPassword={onDisplayForgotPassword}
          />
        )}
      </SlideFade>
      <SlideFade
        in={isOpen}
        offsetY={'50px'}
        {...defaultPropsSlide}
      >
        <CardCreateAccounnt back={onToggle} />
      </SlideFade>
      <Box p={4}>
        <ChangeLanguage />
      </Box>
    </LoginLayout>
  );
};
