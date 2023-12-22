import { Button, Card, CardBody, CardFooter, Heading, Spinner } from '@chakra-ui/react';
import { ButtonBack } from 'components/Button/ButtonBack';
import FormInput from 'components/Inputs/FormInput';
import FormInputMask from 'components/Inputs/FormInputMask';
import { AuthContext } from 'context/Auth/AuthContext';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getChangedValues, removeMaskCnpj } from 'services/ObjectsUtils';
import { Company, CompanyCreate, schemaValidationCompanyCreate } from 'types/CompanyTypes';

const CompanyEdit = () => {
  // prettier-ignore
  const cnpjMask = [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,];
  const { cnpj } = useParams();
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  const { data: company, isFetching } = useQuery<Company>(
    `company-cnpj-${cnpj}`,
    // api/company/{id}/detail
    async () => (await api.get<Company>(`/company/${cnpj}/detail`)).data
  );

  return (
    <Card className="company-edit">
      <Heading
        as="h4"
        size="md"
      >
        <ButtonBack fontSize={'2xl'} />
        {t('common.editCompany')}
      </Heading>
      {isFetching && !company && <Spinner />}
      {company && (
        <Formik
          initialValues={{
            cnpj: company.cnpj,
            fantasia: company.fantasia || '',
            razaoSocial: company.razaoSocial,
          }}
          validationSchema={schemaValidationCompanyCreate}
          onSubmit={(values, actions) => {
            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => !!v)
            ) as CompanyCreate;
            values.cnpj = removeMaskCnpj(values.cnpj);

            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => v)
            ) as CompanyCreate;

            const valuesToSend = getChangedValues<CompanyCreate>(values, {
              ...company,
              fantasia: company.fantasia || '',
            });
            api
              .patch<Company>(`/company/${cnpj}/update`, valuesToSend)
              .then((response) => {
                auth.setCompanyAuth({ ...response.data, ...valuesToSend });
                auth.updateCompanyList(response.data.id, valuesToSend);
              })
              .catch((e) => {
                actions.setSubmitting(false);
                console.error(e);

                console.error(e.response.data);
              });
            actions.setSubmitting(false);
          }}
        >
          {(props: FormikProps<CompanyCreate>) => (
            <Form>
              <CardBody className="padding-children">
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
                  placeHolder={t('common.exCompanyName')}
                  required={true}
                  label={t('common.companyName')}
                />
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="linkedin"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  {t('actions.save')}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      )}
    </Card>
  );
};

export default CompanyEdit;
