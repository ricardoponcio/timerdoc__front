import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { AuthContext } from 'context/Auth/AuthContext';
import { api } from 'hooks/useApi';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const BtnExcludeAccount = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sending, setSending] = useBoolean(false);
  const [sended, setSended] = useState(false);
  const auth = useContext(AuthContext);
  const handleExcludeAccount = async () => {
    setSending.on();
    await api.delete(`/user/${auth.user?.id}/remove`);
    setSended(true);
    setSending.off();
  };
  return (
    <Button
      colorScheme={'gray'}
      variant={'ghost'}
      onClick={onOpen}
    >
      {t('common.lblDisableAccount')}
      <Drawer
        placement={'bottom'}
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{t('common.confirmation')}</DrawerHeader>
          <DrawerBody
            display={'flex'}
            flexDirection="column"
            p={4}
          >
            {!sended ? (
              <>
                <Text as={'p'}>{t('common.confirmDisableAccount')}</Text>
                <Box
                  w={'25em'}
                  my={4}
                >
                  <Button
                    onClick={onClose}
                    isDisabled={sending}
                  >
                    {t('common.no')}
                  </Button>
                  <Button
                    onClick={handleExcludeAccount}
                    float={'right'}
                    isLoading={sending}
                  >
                    {t('common.yes')}
                  </Button>
                </Box>
              </>
            ) : (
              <Text>{t('common.disableAccountIntructionEmail')}</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Button>
  );
};
