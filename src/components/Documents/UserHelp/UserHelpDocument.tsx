import { ButtonProps } from '@chakra-ui/react';
import { HelpUsageBtn } from 'components/UserHelper/HelpUsageBtn';
import { useTranslation } from 'react-i18next';

const defaultProps: ButtonProps = {
  h: '5',
  fontSize: '2xl',
  variant: 'ghost',
  colorScheme: 'linkedin',
};
export const UserHelpRecorrence = () => {
  const { t } = useTranslation();
  return (
    <HelpUsageBtn
      {...defaultProps}
      title={t('document.aboutRecurrence')}
    >
      {t('document.helpTextlRecurrence')}
    </HelpUsageBtn>
  );
};

export const UserHelpValueDefault = () => {
  const { t } = useTranslation();
  return (
    <HelpUsageBtn
      {...defaultProps}
      title={t('document.aboutValueDefault')}
    >
      {t('document.helpTextlValueDefault')}
    </HelpUsageBtn>
  );
};
