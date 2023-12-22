import { Flex, Heading, Text } from '@chakra-ui/react';
import { HelpUsageBtn } from 'components/UserHelper/HelpUsageBtn';
import { AuthContext } from 'context/Auth/AuthContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BiMessageSquareAdd } from 'react-icons/bi';

export const NoRegisteredCompany = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);

  return (
    <Flex
      gap={2}
      flexDirection={'column'}
    >
      <Heading
        size={'xl'}
        as={'h2'}
        maxW={'800px'}
      >
        {t('user.firstAcess.title', { userName: auth.user?.nome })}
      </Heading>
      <Text
        as={'section'}
        fontSize="3xl"
      >
        {t('user.firstAcess.goTo')}
      </Text>
      <Text
        as={'section'}
        display={'flex'}
        gap={3}
      >
        {t('user.firstAcess.useButton')}
        <Text
          as={'span'}
          fontSize={'2xl'}
        >
          <BiMessageSquareAdd />
        </Text>
        {t('user.firstAcess.goContinue')}
      </Text>
      <Text
        as={'section'}
        display={'flex'}
        mt={'2em'}
      >
        {t('user.firstAcess.findIconHelp_right')}
        <HelpUsageBtn
          size={'md'}
          h={'20px'}
          p={0}
          border={0}
          variant={'link'}
          fontSize={'4xl'}
          title={t('user.firstAcess.canHelpYou')}
        >
          {t('user.firstAcess.canHelpYouDesc')}
        </HelpUsageBtn>
        {t('user.firstAcess.findIconHelp_left')}
      </Text>
    </Flex>
  );
};
