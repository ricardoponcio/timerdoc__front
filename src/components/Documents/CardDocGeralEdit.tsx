import {
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { ButtonBack } from 'components/Button/ButtonBack';
import { keyDataCacheDocuments } from 'components/DocumentsDashboards/CardTableDocuments';
import { ButtonHistory } from 'components/History/ButtonHistory';
import FormInput from 'components/Inputs/FormInput';
import FormInputDate from 'components/Inputs/FormInputDate';
import FormInputNumber from 'components/Inputs/FormInputNumber';
import FormInputTextArea from 'components/Inputs/FormInputTextArea';
import FormSelectArray from 'components/Inputs/FormSelectArray';
import ConfirmModal from 'components/Modal/ConfirmModal';
import { Form, Formik, FormikProps } from 'formik';
import { useDisableDocInicio, useDisableRecorrencia } from 'hooks/state/useDocuments';
import { api } from 'hooks/useApi';
import moment from 'moment';
import 'pages/Documents/DocumentRead.sass';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toISOStringDateSimple } from 'services/DatesUtil';
import { getChangedValues } from 'services/ObjectsUtils';
import { PeriodicidadeDocumento } from 'types/DocumentPeriodicity';
import { DocumentCreate, DocumentGeneral, schemaValidationDocument } from 'types/Documets';
import { DocumentContext } from './DocumentContext';

export default function CardDocGeralEdit({ id }: { id: number }) {
  const disCancelDoc = useDisclosure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const documentContext = useContext(DocumentContext);
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [displayDtLancamento, setDisplayDtLancamento] = useState(false);
  const [disableRecorrencia] = useDisableRecorrencia();
  const [disableDocIni] = useDisableDocInicio();
  const updateDataDocuments = (idDocument: number, data: Partial<DocumentGeneral>) => {
    const documets = queryClient.getQueryData<DocumentGeneral[]>(keyDataCacheDocuments);
    if (documets)
      queryClient.setQueryData(
        keyDataCacheDocuments,
        documets.map((doc) => (idDocument === doc.id ? { ...doc, ...data } : doc))
      );
  };
  const { data: document, isFetching } = useQuery<DocumentGeneral>(
    `document-${id}`,
    async () => (await api.get<DocumentGeneral>(`documents/${id}/detail`)).data,
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 120, // 120s
      onSuccess: (data) => {
        documentContext.setDocument(data);
      },
    }
  );
  const handleRemoveDocument = async () => {
    setLoadingDelete(true);
    api
      .delete(`/documents/${id}/remove`)
      .then(() => {
        const documets = queryClient.getQueryData<DocumentGeneral[]>(keyDataCacheDocuments);
        if (documets)
          queryClient.setQueryData(
            keyDataCacheDocuments,
            documets.filter((doc) => id !== doc.id)
          );
        setLoadingDelete(false);
        navigate('/');
      })
      .catch((e) => {
        setLoadingDelete(false);
        console.error(e);
      });
  };
  const displayLancamento = displayDtLancamento
    ? moment(document?.lancamento).format('L LTS')
    : moment(document?.lancamento).fromNow();
  const changeDisplay = () => {
    setDisplayDtLancamento(!displayDtLancamento);
  };
  const btnProps: ButtonProps = {
    variant: 'ghost',
    borderRadius: '50px',
    fontSize: '3xl',
  };
  const fieldAffectRecorrencia = {
    disabled: disableRecorrencia,
    helpText: !disableRecorrencia ? undefined : t('document.helpTextlDisableRecurrence'),
  };
  const fieldAffectDocIni = {
    disabled: disableDocIni,
    helpText: !disableDocIni ? undefined : t('document.helpTextlDisableDocStar'),
  };
  return (
    <Card
      variant="elevated"
      id="card-doc-general"
      key="card-doc-general"
    >
      <CardHeader
        className=""
        css={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <ButtonBack {...btnProps} />
        <Heading css={{ width: '100%', textAlign: 'center' }}>{document?.nome}</Heading>
        <ButtonHistory
          endPonint={`documents/${id}/history`}
          titleHearder={document?.nome}
          btnProps={btnProps}
        />
      </CardHeader>

      <CardBody>
        {isFetching && <p>{t('actions.loading')}...</p>}
        {document && (
          <Formik
            initialValues={{
              nome: document.nome,
              diasAvisoVencimento: document.diasAvisoVencimento,
              periodicidade: document.periodicidade,
              recorrencia: document.recorrencia,
              valorPadrao: document.valorPadrao,
              descricao: document.descricao || '',
              inicioContagem: document.inicioContagem.toString().split('T')[0],
              fimContagem: document.fimContagem?.toString().split('T')[0] || '',
            }}
            validationSchema={schemaValidationDocument}
            onSubmit={(values, actions) => {
              values = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v || v === 0)
              ) as DocumentCreate;

              const valuesToSend = getChangedValues<DocumentCreate>(values, {
                ...document,
                inicioContagem: document.inicioContagem.toString().split('T')[0],
                fimContagem: document.fimContagem?.toString().split('T')[0] || '',
              });
              if (valuesToSend.inicioContagem)
                valuesToSend.inicioContagem = toISOStringDateSimple(valuesToSend.inicioContagem);
              if (valuesToSend.fimContagem)
                valuesToSend.fimContagem = toISOStringDateSimple(valuesToSend.fimContagem);

              api
                .patch<DocumentGeneral>(`/documents/${id}/update`, valuesToSend)
                .then((response) => {
                  actions.setSubmitting(false);
                  queryClient.setQueryData(`document-${id}`, response.data);
                  updateDataDocuments(id, response.data);
                })
                .catch((e) => {
                  actions.setSubmitting(false);
                  console.error(e);
                });
            }}
          >
            {(props: FormikProps<DocumentCreate>) => (
              <Form className="padding-children">
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
                    min={0}
                    required={true}
                    label={t('document.lblRecurrence')}
                    {...fieldAffectRecorrencia}
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
                    {...fieldAffectRecorrencia}
                  />
                </Flex>
                <Flex gap={3}>
                  <FormInputDate
                    name="inicioContagem"
                    required={true}
                    label={t('document.start')}
                    {...fieldAffectDocIni}
                  />
                  <FormInputDate
                    name="fimContagem"
                    required={false}
                    label={t('document.end')}
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
                  />
                </Flex>
                <Flex css={{ gap: '0.5rem', paddingTop: '1em' }}>
                  <FormControl>
                    <FormLabel>{t('common.createdBy')}</FormLabel>
                    <Input
                      value={document.usuario?.nome}
                      variant="filled"
                      isReadOnly={true}
                      colorScheme="facebook"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('common.createdAt')}</FormLabel>
                    <Input
                      textTransform={'capitalize'}
                      value={displayLancamento}
                      onMouseEnter={changeDisplay}
                      onMouseLeave={changeDisplay}
                      variant="filled"
                      isReadOnly={true}
                      colorScheme="facebook"
                    />
                  </FormControl>
                </Flex>
                <Flex mt="1rem">
                  <Button
                    colorScheme="blue"
                    isLoading={loadingDelete}
                    onClick={disCancelDoc.onOpen}
                  >
                    {t('document.cancel')}
                    <ConfirmModal
                      continue={handleRemoveDocument}
                      disClose={disCancelDoc}
                      message={t('document.confirmCancel')}
                    />
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {t('actions.save')}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        )}
      </CardBody>
    </Card>
  );
}
