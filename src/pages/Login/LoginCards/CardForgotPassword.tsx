import { Button } from '@chakra-ui/button';
import { Card, CardBody, CardHeader } from '@chakra-ui/card';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useTranslation } from 'react-i18next';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { useAlert } from 'types/Alert';
import { EmailField, schemaValidationEmail } from '../LoginTypes';

export const CardForgotPassword = ({ forgotPassword }: { forgotPassword: () => void }) => {
  const [alert, setAlert] = useAlert();
  const { t } = useTranslation();
  return (
    <Card
      size={'lg'}
      width={'80%'}
      variant={'filled'}
      className={'card-default card-forgot-password'}
    >
      <CardHeader
        py={'30px'}
        fontSize={20}
        color={'#ADB8BA'}
        textAlign={'center'}
        textTransform={'uppercase'}
      >
        <IoReturnUpBackOutline
          className="back"
          onClick={forgotPassword}
        />
        <span>{t('login.forgotMyPassword')}</span>
      </CardHeader>
      <CardBody pt={0}>
        {alert && <AlertFull {...alert} />}
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={schemaValidationEmail}
          onSubmit={async (values, actions) => {
            api
              .post('/auth/recover-password', values)
              .then(() => {
                actions.resetForm();
                setAlert({
                  type: 'info',
                  title: t('common.sucess'),
                  msg: t('login.verifyEmailRecover'),
                });
                setTimeout(() => setAlert(undefined), 10000);
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
          {(props: FormikProps<EmailField>) => (
            <Form className="bt-children">
              <FormInput
                name="email"
                type="email"
                placeHolder={t('common.phEmail')}
                required={true}
                label="Email"
              />
              <Button
                float={'right'}
                mt={5}
                colorScheme="twitter"
                isLoading={props.isSubmitting}
                type="submit"
              >
                {t('actions.recover')}
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
