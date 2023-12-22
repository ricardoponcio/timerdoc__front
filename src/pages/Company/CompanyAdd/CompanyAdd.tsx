import { Box, Button, Container, Heading } from '@chakra-ui/react';
import { AlertFull } from 'components/Alert/AlertFull';
import { ChangeLanguage } from 'components/I18n/ChangeLanguage';
import FormInput from 'components/Inputs/FormInput';
import FormInputMask from 'components/Inputs/FormInputMask';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { keyCompanyChoice } from 'pages/Company/CompanyChoice/CompanyChoice';
import { useTranslation } from 'react-i18next';
import { IoReturnUpBack } from 'react-icons/io5';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { removeMaskCnpj } from 'services/ObjectsUtils';
import { useAlert } from 'types/Alert';
import { ErrorApi } from 'types/Responses/ResponseApi';
import {
  CompanyCreate,
  CompanyRole,
  schemaValidationCompanyCreate,
} from '../../../types/CompanyTypes';

export const CompanyAdd = () => {
  // prettier-ignore
  const cnpjMask = [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,];
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [alert, setAlert] = useAlert();

  return (
    <main className="container-company company-create">
      <Container maxW="container.xl">
        <Heading
          display={'flex'}
          gap={'50px'}
        >
          <IoReturnUpBack
            cursor={'pointer'}
            size="1em"
            onClick={() => navigate(-1)}
          />
          {t('company.create')}
          {alert && (
            <Box fontSize={'2xl'}>
              <AlertFull {...alert} />
            </Box>
          )}
        </Heading>
        <Formik
          initialValues={{
            cnpj: '',
            fantasia: '',
            razaoSocial: '',
          }}
          validationSchema={schemaValidationCompanyCreate}
          onSubmit={(values, actions) => {
            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => !!v)
            ) as CompanyCreate;
            values.cnpj = removeMaskCnpj(values.cnpj);

            api
              .post<CompanyRole>('/company/new', values)
              .then((response) => {
                const dataCache = queryClient.getQueryData<CompanyRole[]>(keyCompanyChoice);
                if (dataCache)
                  queryClient.setQueryData<CompanyRole[]>(keyCompanyChoice, [
                    ...dataCache,
                    response.data,
                  ]);
                navigate('/companys');
              })
              .catch((e) => {
                actions.setSubmitting(false);
                if (!e.response.data.error) throw e;
                const error = e.response.data as ErrorApi;
                setAlert({ type: 'error', title: `${error.errorCode}`, msg: error.error });
              });
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<CompanyCreate>) => (
            <Form>
              <FormInputMask
                name="cnpj"
                mask={cnpjMask}
                placeHolder="CNPJ"
                required={true}
                label="CNPJ"
              />
              <FormInput
                name="fantasia"
                placeHolder={t('common.tradingName')}
                required={false}
                label={t('common.tradingName')}
              />
              <FormInput
                name="razaoSocial"
                placeHolder={t('common.companyName')}
                required={true}
                label={t('common.companyName')}
              />
              <Button
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                {t('actions.save')}
              </Button>
            </Form>
          )}
        </Formik>
        <ChangeLanguage />
      </Container>
    </main>
  );
};
