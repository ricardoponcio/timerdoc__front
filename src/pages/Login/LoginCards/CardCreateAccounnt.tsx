import { Button, Card, CardBody, CardHeader } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useTranslation } from 'react-i18next';
import { BsArrowUp } from 'react-icons/bs';
import { useAlert } from 'types/Alert';
import { schemaValidationUserCreate, UserCreate } from 'types/User';

export const CardCreateAccounnt = (props: { className?: string; back: () => void }) => {
  const [alert, setAlert] = useAlert();
  const { t } = useTranslation();
  return (
    <Card
      className={`card-default ${props.className}`}
      size={'lg'}
      variant={'filled'}
    >
      <div className="relative">
        <Button
          className="button-back"
          variant={'ghost'}
          onClick={props.back}
        >
          <BsArrowUp />
        </Button>
        <CardHeader className="title">{t('login.associate')}</CardHeader>
      </div>
      <CardBody pt={0}>
        <Formik
          initialValues={{
            email: '',
            nome: '',
            telefone: '',
          }}
          validationSchema={schemaValidationUserCreate}
          onSubmit={(values, actions) => {
            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => !!v)
            ) as UserCreate;
            const sucesso = {
              type: 'success',
              color: '',
              msg: t('login.verifyEmailRegister'),
              title: t('common.sucess'),
            } as const;
            api
              .post('/auth/register', values)
              .then(() => {
                actions.resetForm();
                setAlert(sucesso);
              })
              .catch((e: AxiosError<{ status: number }>) => {
                console.error('Erro', e);
                setAlert({ type: 'error', msg: 'Falha no cadastro', title: 'Erro' });
              });
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<UserCreate>) => (
            <Form className="bt-children">
              {alert && <AlertFull {...alert} />}
              <FormInput
                name="nome"
                placeHolder={t('common.nameFull')}
                required={true}
                label={t('common.name')}
              />
              <FormInput
                name="email"
                type="email"
                placeHolder={t('common.phEmail')}
                required={true}
                label="Email"
              />

              <FormInput
                name="telefone"
                type="text"
                label={t('common.phone')}
              />
              <Button
                float={'right'}
                mt={5}
                colorScheme="twitter"
                isLoading={props.isSubmitting}
                type="submit"
              >
                {t('actions.create')}
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
