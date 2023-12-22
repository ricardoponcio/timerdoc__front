import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import { AuthContext } from 'context/Auth/AuthContext';
import { Form, Formik, FormikProps } from 'formik';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from 'services/RoutesUtil';
import { useAlert } from 'types/Alert';
import { ErrorApi } from 'types/Responses/ResponseApi';
import { LoginField, schemaValidationLogin } from '../LoginTypes';

export const CardLoginAcess = ({
  className,
  createAccount,
  forgotPassword,
}: {
  className?: string;
  createAccount: () => void;
  forgotPassword: () => void;
}) => {
  const to: string | undefined = useQueryParams().getAll('to')[0];
  const [error, setError] = useAlert();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Card
      color={'#92AED1'}
      size={'lg'}
      width={'80%'}
      backgroundColor={'#3C525C'}
      variant={'filled'}
      className={`card-default ${className}`}
    >
      <CardHeader
        py={'30px'}
        fontSize={20}
        color={'#ADB8BA'}
        textAlign={'center'}
        textTransform={'uppercase'}
      >
        {t('login.timerdocAccess')}
      </CardHeader>
      <CardBody pt={0}>
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={schemaValidationLogin}
            onSubmit={async (values, actions) => {
              try {
                const isLogado = await auth.signin(values.email, values.password);
                if (isLogado) {
                  navigate(!to ? '/companys' : to);
                  return;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                // debugger;
                if (!axios.isAxiosError(error) && error.response) throw error;

                if (error.response.status === 401) {
                  setError({
                    type: 'error',
                    msg: t('error.emailPassordIncorrect'),
                    color: 'red.500',
                  });
                  return;
                }
                const response = error.response?.data as ErrorApi;
                console.error(response.error);
                setError({ type: 'error', msg: response.error, color: 'red.500' });
                actions.setErrors({ email: ' ', password: ' ' });
              }
            }}
          >
            {(props: FormikProps<LoginField>) => (
              <Form className="bt-children">
                {error && <AlertFull {...error} />}
                <FormInput
                  name="email"
                  type="email"
                  placeHolder={t('common.phEmail')}
                  required={true}
                  label="Email"
                />
                <FormInput
                  name="password"
                  type="password"
                  placeHolder="*****"
                  required={true}
                  label={t('common.password')}
                />
                <Button
                  float={'right'}
                  mt={5}
                  colorScheme="twitter"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  {t('actions.enter')}
                </Button>
              </Form>
            )}
          </Formik>
          <HStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            justify="space-between"
          >
            <Button
              onClick={createAccount}
              variant={'unstyled'}
            >
              <Text
                textTransform={'capitalize'}
                textAlign={'start'}
              >
                {t('login.createAccount')}
              </Text>
            </Button>
            <Button
              onClick={forgotPassword}
              variant={'unstyled'}
            >
              <Text
                textTransform={'capitalize'}
                textAlign={'end'}
              >
                {t('login.forgotMyPassword')}
              </Text>
            </Button>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};
