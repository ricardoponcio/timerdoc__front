import { Card, CardBody, CardHeader, Divider, Text } from '@chakra-ui/react';
import { HelpUsageBtn } from 'components/UserHelper/HelpUsageBtn';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TableInvites } from './components/TableInvites';
import './InvitePage.sass';
export const InvitePage = () => {
  const { hash } = useParams();
  const { t } = useTranslation();
  return (
    <Card className="InvitePage">
      <CardHeader>
        <Text as={'h3'}>
          {t('invite.me')}
          <HelpUsageBtn
            title={t('invite.me')}
            ml={6}
            fontSize={24}
          >
            {t('invite.aboutInvitesMe')}
          </HelpUsageBtn>
        </Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <TableInvites />
      </CardBody>
    </Card>
  );
};
