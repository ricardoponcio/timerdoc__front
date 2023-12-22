import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import FormSelectBtn from 'components/Inputs/FormSelectBtn';
import ConfirmModal from 'components/Modal/ConfirmModal';
import { Form, Formik, FormikProps } from 'formik';
import { api } from 'hooks/useApi';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { RoleEnum } from 'types/Role';
import { schemaValidationUserCompanyUpdate, UserCompany, UserCompanyUpdate } from 'types/User';

export const CardCompanyUsers = ({ user }: { user: UserCompany }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const disExlcudeUser = useDisclosure();
  const handleDelete = async () => {
    await api.delete(`/users/${user.usuario.id}/remove`);
    const key = `/users/list_company_${user.empresa.id}`;
    const users = queryClient.getQueryData<UserCompany[]>(key);
    if (!users) return;
    queryClient.setQueryData<UserCompany[]>(
      key,
      users.filter((u) => u.usuario.email !== user.usuario.email)
    );
  };
  const propsBtn = {
    flex: 1,
    fontSize: 'sm',
    rounded: 'full',
    _hover: {
      boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)',
    },
  };
  return (
    <Formik
      initialValues={{
        roleName: user.role?.nome || '',
      }}
      validationSchema={schemaValidationUserCompanyUpdate}
      onSubmit={async (values, actions) => {
        api.patch(`/users/${user.usuario.id}/update`, values);
        actions.setFieldValue('roleName', values.roleName);
      }}
    >
      {(props: FormikProps<UserCompanyUpdate>) => (
        <Form>
          <Box
            maxW={'350px'}
            w={'full'}
            __css={{ border: '1px solid #91B5B4', transition: '0.6s' }}
            _hover={{ bg: useColorModeValue('white', 'gray.900'), boxShadow: '2xl' }}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
          >
            <Heading
              fontSize={'2xl'}
              fontFamily={'body'}
            >
              {user.usuario.nome}
            </Heading>
            <Text
              fontWeight={600}
              color={'gray.500'}
              mb={4}
            >
              {user.usuario.email}
            </Text>

            <Stack
              align={'center'}
              justify={'center'}
              direction={'row'}
              mt={6}
            >
              <FormSelectBtn
                name="roleName"
                custonField={{
                  px: 2,
                  py: 1,
                  bg: useColorModeValue('gray.50', 'gray.800'),
                  fontWeight: '100',
                  fontSize: '0.7em',
                }}
                options={Object.entries(RoleEnum).map((role) => ({
                  label: t(`role.${role[0]}`),
                  value: role[1],
                  selected: role[1] === (user.role?.nome || ''),
                }))}
              />
            </Stack>
            <Stack
              mt={8}
              direction={'row'}
              spacing={4}
            >
              <Button
                colorScheme={'red'}
                {...propsBtn}
                onClick={disExlcudeUser.onOpen}
              >
                <ConfirmModal
                  disClose={disExlcudeUser}
                  // message={`Deseja mesmo que o ${user.usuario.nome} perca acesso aos documentos de ${user.empresa.razaoSocial}`}
                  message={t('common.confirmCancelUserCompany', {
                    userName: user.usuario.nome,
                    companyName: user.empresa.razaoSocial,
                  })}
                  continue={handleDelete}
                />
                {t('actions.delete')}
              </Button>
              <Button
                colorScheme={'linkedin'}
                {...propsBtn}
                onClick={props.submitForm}
              >
                {t('actions.save')}
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
