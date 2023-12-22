/* eslint-disable indent */
import {
  Alert,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react';
import { AlertFull } from 'components/Alert/AlertFull';
import {
  UserHelpRecorrence,
  UserHelpValueDefault,
} from 'components/Documents/UserHelp/UserHelpDocument';
import FormInput from 'components/Inputs/FormInput';
import FormInputDate from 'components/Inputs/FormInputDate';
import FormInputNumber from 'components/Inputs/FormInputNumber';
import FormInputTextArea from 'components/Inputs/FormInputTextArea';
import FormSelectArray from 'components/Inputs/FormSelectArray';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useBooleanHoverIcon } from 'hooks/useBooleanHoverIcon';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { toISOStringDateSimple } from 'services/DatesUtil';
import { useAlert } from 'types/Alert';
import {
  getDisplayPeriodicade,
  getInterval,
  PeriodicidadeDocumento,
} from 'types/DocumentPeriodicity';
import { DocumentCreate, DocumentGeneral, schemaValidationDocument } from 'types/Documets';
import { ErrorApi } from 'types/Responses/ResponseApi';

function DocumentModal({
  state,
  modalState,
  onSucess,
}: {
  state: boolean;
  modalState: (close: boolean) => void;
  onSucess: (newDoc: DocumentGeneral) => void;
}) {
  const { t } = useTranslation();
  const [alert, setAlert] = useAlert();
  const { hover, ...propsHover } = useBooleanHoverIcon();
  return (
    <Modal
      isOpen={state}
      onClose={() => modalState(false)}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('document.newDocumentManagement')}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            nome: '',
            descricao: '',
            diasAvisoVencimento: 1,
            inicioContagem: new Date().toISOString().split('T')[0],
            fimContagem: '',
            periodicidade: PeriodicidadeDocumento.MES,
            recorrencia: 1,
            valorPadrao: 0,
          }}
          validationSchema={schemaValidationDocument}
          onSubmit={(values, actions) => {
            values.inicioContagem = toISOStringDateSimple(values.inicioContagem);
            if (values.fimContagem) values.fimContagem = toISOStringDateSimple(values.fimContagem);
            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => v || v === 0)
            ) as DocumentCreate;
            api
              .post('/documents/new', values)
              .then((response) => {
                actions.setSubmitting(false);
                modalState(false);
                onSucess(response.data);
              })
              .catch((e) => {
                actions.setSubmitting(false);
                const error = e.response.data as ErrorApi;
                setAlert({ type: 'error', msg: error.error as string });
              });
          }}
        >
          {(props: FormikProps<DocumentCreate>) => (
            <Form>
              <ModalBody>
                <FormInput
                  name="nome"
                  placeHolder={t('document.lblName')}
                  required={true}
                  label={t('document.lblName')}
                />
                <FormInputTextArea
                  name="descricao"
                  required={false}
                  placeHolder={t('document.phDescription')}
                  label={t('document.lblDescription')}
                />
                <Flex css={{ gap: '0.5rem' }}>
                  <FormInputNumber
                    name="recorrencia"
                    required={true}
                    min={0}
                    label={t('document.lblRecurrence')}
                    // helpText={t('document.helpTextlRecurrence')}
                    help={<UserHelpRecorrence />}
                  />
                  <Spacer />
                  <FormSelectArray
                    name="periodicidade"
                    options={Object.values(PeriodicidadeDocumento).map((p) => ({
                      value: p,
                      label: t('frequency.key' + p, { count: 1 }),
                    }))}
                    required={true}
                    label={t('document.lblFrequency')}
                  />
                </Flex>
                <Flex gap={3}>
                  <FormInputDate
                    name="inicioContagem"
                    required={true}
                    label={t('document.start')}
                  />
                  <FormInputDate
                    name="fimContagem"
                    required={false}
                    label={t('document.end')}
                    minDate={moment(props.values.inicioContagem).toDate()}
                  />
                </Flex>
                <Flex css={{ gap: '0.5rem' }}>
                  <FormInputNumber
                    name="diasAvisoVencimento"
                    label={t('document.lblExpirationNoticeDays')}
                    required={true}
                  />
                  <FormInputNumber
                    name="valorPadrao"
                    required={true}
                    label={t('document.valueDefault')}
                    min={0}
                    precision={2}
                    step={0.01}
                    help={<UserHelpValueDefault />}
                  />
                </Flex>
              </ModalBody>

              <Alert
                textAlign={'center'}
                {...propsHover}
              >
                {hover
                  ? t('document.keyOcurrencePlain', {
                      count: props.values.recorrencia,
                      periodicy: t('frequency.key' + props.values.periodicidade, {
                        count: props.values.recorrencia,
                      }),
                    })
                  : t('document.previusOcurrence') +
                    getInterval(
                      props.values.periodicidade,
                      moment(props.values.inicioContagem),
                      props.values.fimContagem ? moment(props.values.fimContagem) : undefined,
                      props.values.recorrencia > 0 ? 3 : 1,
                      props.values.recorrencia > 0 ? props.values.recorrencia : 1
                    )
                      .filter((_, i) => i < 3)
                      .map((date) => getDisplayPeriodicade(date, props.values.periodicidade))
                      .join(', ')
                      .concat('...')}
              </Alert>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => modalState(false)}
                >
                  Cancelar
                </Button>
                <Spacer />
                <Button
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  {t('actions.save')}
                </Button>
              </ModalFooter>
              {alert && <AlertFull {...alert} />}
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default DocumentModal;
