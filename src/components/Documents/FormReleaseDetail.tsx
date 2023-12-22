import {
  Button,
  CardBody,
  CardFooter,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { AlertAppBeta } from 'components/Alert/AlertAppBeta';
import FormInputDate from 'components/Inputs/FormInputDate';
import ConfirmModal from 'components/Modal/ConfirmModal';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { toISOStringDateSimple, toISOStringWithTimezone } from 'services/DatesUtil';
import { getChangedValues } from 'services/ObjectsUtils';
import {
  DocReleaseCreate,
  DocumentRelease,
  schemaValidationRelease,
  SituacaoRelease,
} from '../../types/DocumentRelease';
import FormInputTextArea from '../Inputs/FormInputTextArea';
import FormSelectArray from '../Inputs/FormSelectArray';
import { UploadContainer } from '../Inputs/UploadFile/UploadContainer';

export const FormReleaseDetail = ({
  release,
  onUpdateSucess,
  defaultCacheUrl,
  setRelease,
  keyBaseUrl,
}: {
  release: DocumentRelease;
  defaultCacheUrl: string;
  keyBaseUrl: string;
  setRelease: React.Dispatch<React.SetStateAction<DocumentRelease | null>>;
  onUpdateSucess: (release: DocumentRelease) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const disSave = useDisclosure();
  const disCancel = useDisclosure();
  const cancelRelese = async () => {
    await api.delete(`${defaultCacheUrl}/remove`);
    setRelease(null);
    queryClient.invalidateQueries(keyBaseUrl);
  };
  return (
    <>
      <Formik
        initialValues={{
          situacao: release.situacao,
          competenciaReferencia: moment(release.competenciaReferencia).format('L'),
          descricao: release.descricao || '',
          entrega: toISOStringWithTimezone(release.entrega).split('T')[0],
          prazo: toISOStringWithTimezone(release.prazo).split('T')[0],
        }}
        validationSchema={schemaValidationRelease}
        onSubmit={async (values, actions) => {
          values = Object.fromEntries(
            Object.entries(values).filter(([, v]) => v)
          ) as DocReleaseCreate;

          const valuesToSend = getChangedValues<DocReleaseCreate>(values, {
            ...release,
            competenciaReferencia: moment(release.competenciaReferencia).format('L'),
            entrega: toISOStringWithTimezone(release.entrega).split('T')[0],
            prazo: toISOStringWithTimezone(release.prazo).split('T')[0],
            descricao: release.descricao || '',
          });
          if (valuesToSend.entrega)
            valuesToSend.entrega = toISOStringDateSimple(valuesToSend.entrega);
          if (valuesToSend.prazo) valuesToSend.prazo = toISOStringDateSimple(valuesToSend.prazo);
          const { data: updatedRelease } = await api.patch<DocumentRelease>(
            `${defaultCacheUrl}/update`,
            valuesToSend
          );
          queryClient.setQueryData(defaultCacheUrl, updatedRelease);
          onUpdateSucess(updatedRelease);

          actions.setSubmitting(false);
        }}
      >
        {(propsForm: FormikProps<DocReleaseCreate>) => (
          <Form>
            <CardBody py={0}>
              <FormInputDate
                name="entrega"
                required={true}
                label={t('release.lblDelivery')}
              />
              <FormInputDate
                name="prazo"
                required={false}
                label={t('release.lblTerm')}
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
              <FormInputTextArea
                name="descricao"
                required={false}
                placeHolder={t('document.phDescription')}
                label={t('document.lblDescription')}
              />
              <Flex
                pt={'1em'}
                gap={'1em'}
              >
                <FormControl>
                  <FormLabel>{t('common.createdAt')}</FormLabel>
                  <Input
                    value={release.dataCriacao.toString().replace(/[.]\d+Z$|Z$/gm, '') || ''}
                    variant="filled"
                    isReadOnly={true}
                    colorScheme="facebook"
                    type="datetime-local"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('common.updated')}</FormLabel>
                  <Input
                    value={release.dataAtualizacao?.toString().replace(/[.]\d+Z$|Z$/gm, '') || ''}
                    variant="filled"
                    isReadOnly={true}
                    colorScheme="facebook"
                    type="datetime-local"
                  />
                  <div></div>
                </FormControl>
              </Flex>
            </CardBody>
            <CardFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={disCancel.onOpen}
              >
                {t('release.cancel')}
                <ConfirmModal
                  loading={propsForm.isSubmitting}
                  continue={cancelRelese}
                  disClose={disCancel}
                  message={t('release.confirmCancel')}
                />
              </Button>
              <Spacer />
              <Button
                colorScheme="teal"
                isLoading={propsForm.isSubmitting}
                onClick={disSave.onOpen}
              >
                {t('actions.save')}
                <ConfirmModal
                  loading={propsForm.isSubmitting}
                  continue={propsForm.submitForm}
                  disClose={disSave}
                  message={t('common.confirmUpdate')}
                />
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
      <AlertAppBeta />
      <UploadContainer
        urlBaseRequest={`${defaultCacheUrl}`}
        prevList={release.anexos}
      />
      {/* Utilizando o InputFileH esta dando erro para buscar e envio duplicado de blob , será feito de maneira mais simples por hora */}
      {/* <InputFileH url={`${defaultCacheUrl}/upload`} files={release?.anexos} /> */}
      {/* <InputFileBasic
            url={`${defaultCacheUrl}/upload`}
            files={release?.anexos}
          />
    
          <Flex wrap={'wrap'} justifyContent={'space-around'}>
            {release?.anexos?.map((anexo) => (
              <Button key={anexo.id} colorScheme={'telegram'} mt={2} >
                <BsFillFileEarmarkFill />
                <a target={'_blank'} href={anexo.referencia}>
                  {anexo.nomeArquivo}
                </a>
              </Button>
            ))}
          </Flex> */}
    </>
  );
};
