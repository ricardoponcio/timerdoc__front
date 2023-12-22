import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react';
import { DocumentContext } from 'components/Documents/DocumentContext';
import FormInputDate from 'components/Inputs/FormInputDate';
import FormInputTextArea from 'components/Inputs/FormInputTextArea';
import FormSelectArray from 'components/Inputs/FormSelectArray';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { toISOStringDateSimple, toISOStringWithTimezone } from 'services/DatesUtil';
import { getDisplayPeriodicade, PeriodicidadeDocumento } from 'types/DocumentPeriodicity';
import {
  DocReleaseCreate,
  DocumentRelease,
  schemaValidationRelease,
  SituacaoRelease,
} from 'types/DocumentRelease';
type PreviewReleases = {
  data: string;
  status: SituacaoRelease;
  realizada: boolean;
  entregue: boolean;
};
export default function DocumentReleaseCreateModal(props: {
  state: boolean;
  idDoc: number;
  dates: { inicioContagem: Date; fimContagem?: Date };
  periodicity?: PeriodicidadeDocumento;
  repeat?: number;
  onSucess: (release: DocumentRelease) => void;
  modalOpen: (close: boolean) => void;
}) {
  const docContext = useContext(DocumentContext);
  const { t } = useTranslation();
  const [prevFirtSelect, setPrevFirtSelect] = useState<string>();
  const getPeriodicity = () => {
    if (props.periodicity) return props.periodicity;
    if (docContext?.document) return docContext?.document.periodicidade;
    return PeriodicidadeDocumento.DIA;
  };
  const displayPreviewLabel = (preview: PreviewReleases): string => {
    let display = getDisplayPeriodicade(preview.data, periodicity);
    if (preview.realizada) display += ' - Realizada';
    if (preview.entregue) display += ' - Entregue';
    return display;
  };
  const { data: previews } = useQuery<PreviewReleases[]>(
    `preview-doc-${props.idDoc}`,
    async () =>
      (await api.get<PreviewReleases[]>(`documents/${props.idDoc}/release/preview`)).data.map(
        (p) => ({ ...p, data: p.data.split('T')[0] })
      ),
    {
      enabled: props.state,
      onSuccess: (prevs) =>
        setPrevFirtSelect(prevs.find((prev) => !(prev.realizada || prev.entregue))?.data),
    }
  );

  // const { inicioContagem, fimContagem } = docContext?.document ? docContext.document : props.dates;
  const periodicity = getPeriodicity();
  // const repeatUsage = props.repeat || docContext?.document?.recorrencia || 1;

  return (
    <Modal
      isOpen={props.state}
      onClose={() => props.modalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('release.startNew')}</ModalHeader>
        <ModalCloseButton />
        <Formik
          enableReinitialize
          initialValues={{
            situacao: SituacaoRelease.INICIADO,
            descricao: '',
            entrega: toISOStringWithTimezone(new Date()).split('T')[0],
            prazo: toISOStringWithTimezone(new Date()).split('T')[0],
            competenciaReferencia: prevFirtSelect || '0000-00-00',
          }}
          validationSchema={schemaValidationRelease}
          onSubmit={(values, actions) => {
            values.entrega = toISOStringDateSimple(values.entrega);
            if (values.prazo) values.prazo = toISOStringDateSimple(values.prazo);

            values = Object.fromEntries(
              Object.entries(values).filter(([, v]) => v)
            ) as DocReleaseCreate;

            api
              .post<DocumentRelease>(`/documents/${props.idDoc}/release/new`, values)
              .then((response) => {
                actions.setSubmitting(false);
                props.modalOpen(false);
                props.onSucess(response.data);
              })
              .catch((e) => {
                actions.setSubmitting(false);
                console.error(e);

                console.error(e.response.data);
              });
          }}
        >
          {(propsForm: FormikProps<DocReleaseCreate>) => (
            <Form>
              <ModalBody>
                <FormInputDate
                  name="entrega"
                  required={true}
                  label={`${t('document.start')} | ${t('release.lblDelivery')}`}
                />
                <FormInputDate
                  name="prazo"
                  required={false}
                  label={`${t('document.end')} | ${t('release.lblTerm')}`}
                />
                <FormSelectArray
                  name="situacao"
                  options={Object.values(SituacaoRelease).map((p) => ({
                    value: p,
                    label: t('situation.' + p),
                  }))}
                  required={true}
                  label={t('common.situation')}
                />
                <FormSelectArray
                  name="competenciaReferencia"
                  options={previews?.map((previewRelease) => ({
                    label: displayPreviewLabel(previewRelease),
                    value: previewRelease.data,
                    disable: previewRelease.realizada || previewRelease.entregue,
                  }))}
                  // options={getInterval(
                  //   periodicity,
                  //   inicioContagem,
                  //   fimContagem ? new Date(fimContagem) : new Date(),
                  //   repeatUsage
                  // )?.map((dateRelease) => {
                  //   let label = getDisplayPeriodicade(dateRelease, periodicity);
                  //   const exists = previews?.find((preview) => preview.data === dateRelease);
                  //   if (exists) {
                  //     label += exists.realizada ? ' - Realizada' : '';
                  //     label += exists.entregue ? ' - Entregue' : '';
                  //   }
                  //   return {
                  //     disable: !!exists,
                  //     value: moment(dateRelease).format('YYYY-MM-DD'),
                  //     label: label,
                  //   };
                  // })}
                  required={true}
                  label={t('release.lblCompetence')}
                />
                <FormInputTextArea
                  name="descricao"
                  required={false}
                  placeHolder={t('document.phDescription')}
                  label={t('document.lblDescription')}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => props.modalOpen(false)}
                >
                  {t('actions.cancel')}
                </Button>
                <Spacer />
                <Button
                  colorScheme="teal"
                  isLoading={propsForm.isSubmitting}
                  type="submit"
                >
                  {t('actions.save')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
