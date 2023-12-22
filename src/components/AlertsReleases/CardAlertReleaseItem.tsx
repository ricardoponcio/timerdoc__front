import { CardBody, CardHeader } from '@chakra-ui/react';
import classNames from 'classnames';
import { DocumentGeneralAlert } from 'types/DocumentoGeralAlert';
import './AlertsReleases.sass';

export const CardAlertReleaseItem = ({ alert }: { alert: DocumentGeneralAlert }) => {
  const prioridade = 'alert-' + alert.prioridade.toLocaleLowerCase();
  return (
    <div className={classNames('card-alert-release-item', prioridade)}>
      <CardHeader className={`${prioridade}__head`}>{alert.mensagem}</CardHeader>
      <CardBody>- {alert.descricao}</CardBody>
    </div>
  );
};
