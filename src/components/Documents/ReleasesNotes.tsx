import {
  Button,
  CardBody,
  Divider,
  Flex,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import { Fragment, useContext } from 'react';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { MdCheckCircle } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { AuthContext } from '../../context/Auth/AuthContext';
import { api } from '../../hooks/useApi';
import {
  DocumentRelease,
  ReleaseCreateNote,
  ReleaseNote,
  schemaValidationReleaseNote,
} from '../../types/DocumentRelease';
import FormInputTextArea from '../Inputs/FormInputTextArea';

export const ReleasesNotes = (props: { defaultCacheUrl: string; notes: ReleaseNote[] }) => {
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);
  return (
    <CardBody className="card-release-note">
      <Formik
        initialValues={{
          observacao: '',
        }}
        validationSchema={schemaValidationReleaseNote}
        onSubmit={async (values, actions) => {
          api
            .post<ReleaseNote>(`${props.defaultCacheUrl}/note`, values)
            .then((response) => {
              const cached = queryClient.getQueryData<DocumentRelease>(props.defaultCacheUrl);
              if (!cached) return;
              if (auth.user) response.data.usuario = auth.user;
              cached.observacoes.push(response.data);
              queryClient.setQueryData<DocumentRelease>(props.defaultCacheUrl, cached);
              actions.resetForm();
            })
            .catch((erro) => console.error(erro));

          actions.setSubmitting(false);
        }}
      >
        {(propsForm: FormikProps<ReleaseCreateNote>) => (
          <Form>
            <Button
              color="yellow.500"
              variant={'ghost'}
              isLoading={propsForm.isSubmitting}
              type="submit"
            >
              <BiMessageSquareAdd size={24} />
            </Button>
            <FormInputTextArea
              name="observacao"
              rows={1}
            />
          </Form>
        )}
      </Formik>
      <List>
        {props.notes.map((note, i) => (
          <Fragment key={note.id}>
            {i > 0 && <Divider my={1} />}
            <ListItem className="list-item">
              <ListIcon
                as={MdCheckCircle}
                color="yellow.400"
              />
              <Text
                as="span"
                className="text-note"
              >
                {note.observacao}
              </Text>
              <Spacer className="spacer" />
              <Flex className="info-note">
                <Text>{moment(note.dataCriacao).format('L')}</Text>
                <Text>@{note.usuario?.nome}</Text>
              </Flex>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </CardBody>
  );
};
