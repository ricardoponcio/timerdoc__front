import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
} from '@chakra-ui/react';
import FormInput from 'components/Inputs/FormInput';
import { AuthContext } from 'context/Auth/AuthContext';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { Dispatch, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertDefaultProps } from 'types/Alert';
import { PasswordValidation, schemaValidationPasswordValidation } from 'types/User';
import { BtnExcludeAccount } from './ExcludeAccount/BtnExcludeAccount';

export const AccordionChangePassord = ({
  setAlert,
}: {
  setAlert: Dispatch<React.SetStateAction<AlertDefaultProps | undefined>>;
}) => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  return (
    <Accordion
      flex={1}
      allowMultiple
    >
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box
              as="span"
              textAlign="left"
            >
              {t('common.changePassword')}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Formik
            initialValues={{
              senha: '',
              senhaConfirmacao: '',
            }}
            validationSchema={schemaValidationPasswordValidation}
            onSubmit={(values, actions) => {
              values = Object.fromEntries(
                Object.entries(values).filter(([, v]) => !!v)
              ) as PasswordValidation;
              api
                .patch(`/user/${auth.user?.id}/update`, values)
                .then(() => {
                  setAlert({
                    type: 'success',
                    msg: t('common.updatePasswordsPerformed'),
                    title: t('actions.updated'),
                  });
                })
                .catch(() => {
                  setAlert({
                    type: 'error',
                    msg: t('error.dataSynchronizationFailed'),
                    title: t('error.lblError'),
                  });
                });
              actions.setSubmitting(false);
            }}
          >
            {(propsPassword: FormikProps<PasswordValidation>) => (
              <Form className="bt-children">
                <FormInput
                  name="senha"
                  placeHolder="*****"
                  required
                  label={t('common.password')}
                  type="password"
                />
                <FormInput
                  name="senhaConfirmacao"
                  placeHolder="*****"
                  required
                  label={t('common.passwordConfirmation')}
                  type="password"
                />
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Button
                    colorScheme={
                      Object.values(propsPassword.touched).length && propsPassword.isValid
                        ? 'blue'
                        : 'red'
                    }
                    isLoading={propsPassword.isSubmitting}
                    onClick={propsPassword.submitForm}
                  >
                    {t('actions.save') + ' ' + t('common.password')}
                  </Button>
                  <BtnExcludeAccount />
                </Box>
              </Form>
            )}
          </Formik>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
