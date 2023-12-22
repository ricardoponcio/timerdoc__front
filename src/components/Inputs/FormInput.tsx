import { Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import { BsFillInfoCircleFill } from 'react-icons/bs';

export default function FormInput(props: {
  name: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email';
  backgroundColor?: string;
  errorInTop?: boolean;
  disabled?: boolean;
  helpText?: string;
}) {
  return (
    <Field name={props.name}>
      {({ field, form, meta }: FieldProps & { form: FormikHelpers<any> }) => (
        <FormControl
          backgroundColor={props.backgroundColor}
          isRequired={props.required}
          isDisabled={props.disabled}
          isInvalid={!!form.errors[props.name] && !!form.touched[props.name]}
        >
          <Flex justifyContent={'space-between'}>
            <FormLabel>
              {props.label}{' '}
              {props.helpText && (
                <Icon
                  title={props.helpText}
                  as={BsFillInfoCircleFill}
                />
              )}
            </FormLabel>
            {props.errorInTop && (
              <FormErrorMessage css={{ textAlign: 'end', margin: '0' }}>
                <ErrorMessage name={props.name} />
              </FormErrorMessage>
            )}
          </Flex>
          <Input
            {...field}
            placeholder={props.placeHolder}
            type={props.type || 'text'}
          />
          {!props.errorInTop && (
            <FormErrorMessage>
              <ErrorMessage name={props.name} />
            </FormErrorMessage>
          )}
        </FormControl>
      )}
    </Field>
  );
}
