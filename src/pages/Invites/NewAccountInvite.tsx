import { Button, Card, CardBody, CardHeader, Spinner } from '@chakra-ui/react';
import classNames from 'classnames';
import { AlertAppBeta } from 'components/Alert/AlertAppBeta';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { LoginLayout } from 'pages/Login/LoginLayout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'types/Alert';
import { Invite } from 'types/Invite';
import { schemaValidationUserCreateInvite, UserCreateInvite } from 'types/User';
// /complete-register/41342a50-7d33-42bb-a69e-8cf5bfb62ae5
export const NewAccountInvite = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useAlert();
  const [invite, setInvite] = useState<Invite | undefined>(undefined);
  const { hash } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Invite>(`/users-invite/${hash}/detail`)
      .then((response) => setInvite(response.data))
      .catch((error) =>
        setAlert({
          type: 'error',
          title: error.response.data.errorCode,
          msg: error.response.data.error,
        })
      );
  }, []);

  return (
    <LoginLayout>
      <Card>
        <CardHeader>
          <AlertAppBeta />
        </CardHeader>
        <CardBody className={classNames({ complete_register_center: !invite })}>
          {invite ? (
            <Formik
              initialValues={{
                email: invite.emailConvidado,
                nome: invite.nomeConvidado,
                telefone: '',
                senha: '',
                senhaConfirmacao: '',
              }}
              validationSchema={schemaValidationUserCreateInvite}
              onSubmit={(values, actions) => {
                values = Object.fromEntries(
                  Object.entries(values).filter(([, v]) => !!v)
                ) as UserCreateInvite;

                if (invite.emailConvidado !== values.email) values.email = invite.emailConvidado;

                api
                  .post(`/auth/complete-register/${hash}`, values)
                  .then(() => {
                    actions.resetForm();
                    setAlert({
                      type: 'success',
                      msg: 'Você pode fazer login',
                      title: 'Finalizado',
                    });
                    setTimeout(() => navigate('/login', { replace: true }), 1000 * 5);
                  })
                  .catch((e) => {
                    console.error('Erro', e);
                    setAlert({
                      type: 'error',
                      msg: t('error.failRegister'),
                      title: t('error.lblError'),
                    });
                  });
                actions.setSubmitting(false);
              }}
            >
              {(props: FormikProps<UserCreateInvite>) => (
                <Form className="bt-children">
                  {alert && <AlertFull {...alert} />}
                  <FormInput
                    name="email"
                    type="email"
                    placeHolder={t('common.phEmail')}
                    disabled
                    label="Email"
                  />
                  <FormInput
                    name="nome"
                    placeHolder={t('common.nameFull')}
                    required={true}
                    label={t('common.nameFull')}
                  />

                  <FormInput
                    name="telefone"
                    type="text"
                    label={t('common.phone')}
                  />
                  <FormInput
                    name="senha"
                    placeHolder="*****"
                    required={true}
                    label={t('common.password')}
                    type="password"
                  />
                  <FormInput
                    name="senhaConfirmacao"
                    placeHolder="*****"
                    required={true}
                    label={t('common.passwordConfirmation')}
                    type="password"
                  />
                  <Button
                    float={'right'}
                    mt={5}
                    colorScheme="twitter"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {t('actions.finalize')}
                  </Button>
                </Form>
              )}
            </Formik>
          ) : alert ? (
            <AlertFull {...alert} />
          ) : (
            <Spinner
              thickness="4px"
              color="blue.500"
              boxSize={24}
            />
          )}
        </CardBody>
      </Card>
    </LoginLayout>
  );
};
