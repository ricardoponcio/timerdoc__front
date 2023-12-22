import { Button } from '@chakra-ui/button';
import { Card, CardBody, CardHeader } from '@chakra-ui/card';
import { Box, Checkbox, Link, Text } from '@chakra-ui/react';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAlert } from 'types/Alert';
import { ErrorApi } from 'types/Responses/ResponseApi';
import { PasswordValidation, schemaValidationPasswordValidation } from 'types/User';
import './UserValidation.sass';
export const UserValidation = ({
  verify,
  title = 'orthers.passwordSetting',
}: {
  verify: string;
  title?: string;
}) => {
  const { hash = '' } = useParams();
  const isValidation = useLocation().pathname.startsWith('/validation/');
  const [accept, setAccept] = useState(!isValidation);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const isRemoveUser = verify === '/user/remove/:hash/verify';
  return (
    <main id="user_validation">
      <Card>
        <CardHeader pb={0}>{t(title)}</CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              senha: '',
              senhaConfirmacao: '',
            }}
            validationSchema={schemaValidationPasswordValidation}
            onSubmit={(values, actions) => {
              const valuesSend = Object.fromEntries(Object.entries(values).filter(([, v]) => !!v));
              if (isRemoveUser) delete valuesSend.senhaConfirmacao;
              api
                .post(verify.replace(':hash', hash), valuesSend)
                .then(() => {
                  actions.resetForm();
                  setAlert({
                    type: 'success',
                    msg: isRemoveUser ? '' : t('login.grandedLogin'),
                    title: t('login.confirmSucess'),
                  });
                  setTimeout(() => navigate('/login'), 3500);
                })
                .catch((e) => {
                  const error = e.response?.data as ErrorApi;
                  setAlert({
                    type: 'error',
                    msg: error.error || t('error.failRegister'),
                    title: t('error.lblError'),
                  });
                  actions.setSubmitting(false);
                });
            }}
          >
            {(props: FormikProps<PasswordValidation>) => (
              <Form className="bt-children">
                {alert && <AlertFull {...alert} />}
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
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Checkbox
                    visibility={!isValidation ? 'hidden' : 'visible'}
                    isChecked={accept}
                    onChange={(e) => setAccept(e.target.checked)}
                    mt={'5'}
                    pr="1rem"
                  >
                    <Text fontSize={'10px'}>
                      Ao utilizar o TimerDoc você está de acordo com os
                      <Link
                        color={'blue'}
                        isExternal
                        href="https://timerdoc.com.br/termos/termos-condicoes.html"
                      >
                        {' '}
                        Termos e Condições
                      </Link>{' '}
                      e a
                      <Link
                        color={'blue'}
                        isExternal
                        href="https://timerdoc.com.br/termos/politica-privacidade.html"
                      >
                        {' '}
                        Política de Privacidade
                      </Link>
                      .
                    </Text>
                  </Checkbox>
                  <Button
                    float={'right'}
                    mt={5}
                    px={'10'}
                    isDisabled={!accept}
                    colorScheme="twitter"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {t('actions.enter')}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </main>
  );
};
