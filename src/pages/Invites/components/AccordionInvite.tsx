import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
} from '@chakra-ui/react';
import axios from 'axios';
import { AlertFull } from 'components/Alert/AlertFull';
import FormInput from 'components/Inputs/FormInput';
import FormSelectArray from 'components/Inputs/FormSelectArray';
import { AuthContext } from 'context/Auth/AuthContext';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useAlert } from 'types/Alert';
import { InviteCreate, InviteDto, schemaValidationInviteCreate } from 'types/Invite';
import { ErrorApi } from 'types/Responses/ResponseApi';
import { RoleEnum } from 'types/Role';

export const AccordionInvite = (props: { active: boolean }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  const defaultBtn = { active: true, txt: t('actions.invite') };
  const [btn, setBtn] = useState(defaultBtn);
  const [alert, setAlert] = useAlert();
  return (
    <Accordion
      index={props.active ? [0] : undefined}
      allowMultiple
    >
      <AccordionItem>
        <AccordionButton css={{ display: 'none' }} />
        <AccordionPanel pb={4}>
          <Formik
            initialValues={{
              email: '',
              nome: '',
              roleName: RoleEnum.USUARIO,
            }}
            validationSchema={schemaValidationInviteCreate}
            onSubmit={(values, actions) => {
              api
                .post<InviteDto>('users/new', values)
                .then(({ data: invite }) => {
                  setBtn({ active: false, txt: t('invite.invitationSent') });
                  setTimeout(() => {
                    setBtn(defaultBtn);
                    actions.resetForm();
                  }, 1000 * 5);
                  const keyCache = `/users/open-invites/list_company_${auth.getCompany()?.id}`;
                  const invetesPrev = queryClient.getQueryData<InviteDto[]>(keyCache);
                  invetesPrev?.push(invite);
                  queryClient.setQueryData(keyCache, invetesPrev || [invite]);
                })
                .catch((error) => {
                  if (!axios.isAxiosError(error) && error.response) return;
                  const response = error.response?.data as ErrorApi;
                  setAlert({
                    type: 'error',
                    title: response.errorCode?.toString(),
                    msg: response.error,
                  });
                  setTimeout(() => setAlert(undefined), 1000 * 5); // 5s
                });
              actions.setSubmitting(false);
            }}
          >
            {(props: FormikProps<InviteCreate>) => (
              <Form className="bt-children">
                <br />
                <FormInput
                  name="nome"
                  placeHolder={t('common.nameFull')}
                  required={true}
                  errorInTop={true}
                  label={t('common.name')}
                />
                <FormInput
                  name="email"
                  placeHolder={t('common.phEmail')}
                  required={true}
                  errorInTop={true}
                  label="E-mail"
                  type="email"
                />
                <FormSelectArray
                  name="roleName"
                  options={Object.entries(RoleEnum).map((role) => ({
                    label: t(`role.${role[0]}`),
                    value: role[1],
                  }))}
                  required={true}
                  label={t('common.lblUserProfile')}
                />
                <Button
                  float={'right'}
                  mt={5}
                  colorScheme={btn.active ? 'twitter' : 'whatsapp'}
                  cursor={btn.active ? 'pointer' : 'not-allowed'}
                  isLoading={props.isSubmitting}
                  type="submit"
                  disabled={btn.active}
                >
                  {btn.txt}
                </Button>
              </Form>
            )}
          </Formik>
          {alert && <AlertFull {...alert} />}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
