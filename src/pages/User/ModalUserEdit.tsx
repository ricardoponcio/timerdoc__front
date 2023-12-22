// prettier-ignore
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { AlertFull } from 'components/Alert/AlertFull';
import SkeletonDefault from 'components/Documents/SkeletonDefault';
import FormInput from 'components/Inputs/FormInput';
import { AuthContext } from 'context/Auth/AuthContext';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getChangedValues } from 'services/ObjectsUtils';
import { useAlert } from 'types/Alert';
import { schemaValidationUserCreate, User, UserEdit } from 'types/User';
import { AccordionChangePassord } from './AccordionChangePassord';

export const ModalUserEdit = (props: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useAlert();
  const auth = useContext(AuthContext);
  const { data: user, isFetching } = useQuery<User>(
    `user-${auth.user?.id}`,
    async () => (await api.get<User>('/user/info')).data,
    { refetchOnWindowFocus: false, refetchOnMount: false, enabled: props.isOpen }
  );
  return (
    <Modal
      isCentered
      size={'4xl'}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>{t('common.yourUser')}</ModalHeader>
        <ModalCloseButton />
        {user && !isFetching && (
          <Formik
            initialValues={{
              email: user.email,
              nome: user.nome,
              telefone: user.telefone || '',
            }}
            validationSchema={schemaValidationUserCreate}
            onSubmit={(values, actions) => {
              values = Object.fromEntries(
                Object.entries(values).filter(([, v]) => !!v)
              ) as UserEdit;
              const valuesToSend = getChangedValues<UserEdit>(values, { ...user });

              api
                .patch(`/user/${auth.user?.id}/update`, valuesToSend)
                .then(() => {
                  setAlert({
                    type: 'success',
                    msg: t('orthers.synchronized'),
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
            {(props: FormikProps<UserEdit>) => (
              <Form className="bt-children">
                {alert && <AlertFull {...alert} />}
                <ModalBody className="padding-children">
                  <FormInput
                    name="nome"
                    placeHolder={t('common.nameFull')}
                    required
                    label={t('common.name')}
                  />
                  <FormInput
                    name="email"
                    type="email"
                    placeHolder={t('common.phEmail')}
                    required
                    label="Email"
                  />

                  <FormInput
                    name="telefone"
                    type="text"
                    label={t('common.phone')}
                  />
                </ModalBody>
                <ModalFooter
                  gap={'20px'}
                  alignItems={'flex-start'}
                >
                  <AccordionChangePassord setAlert={setAlert} />
                  <Button
                    colorScheme="twitter"
                    isLoading={props.isSubmitting}
                    onClick={props.submitForm}
                  >
                    {t('actions.save')}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
        {!user && isFetching && <SkeletonDefault noOfLanes={[3, 2, 3]} />}
      </ModalContent>
    </Modal>
  );
};
