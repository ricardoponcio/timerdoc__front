import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import MaskedInput, { Mask } from 'react-text-mask';

export default function FormInputMask(props: {
  name: string;
  mask: Mask | ((value: string) => Mask);
  label?: string;
  placeHolder?: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email';
  backgroundColor?: string;
}) {
  return (
    <Field name={props.name}>
      {({ field, form, meta }: FieldProps & { form: FormikHelpers<any> }) => (
        <FormControl
          backgroundColor={props.backgroundColor}
          isRequired={props.required}
          isInvalid={!!form.errors[props.name] && !!form.touched[props.name]}
        >
          {props.label && (
            <FormLabel
              colorScheme={'blue'}
              variant={'filled'}
            >
              {props.label}
            </FormLabel>
          )}
          <Input
            {...field}
            as={MaskedInput}
            mask={props.mask}
            //maskChar={null}
            // onChange={e => console.log(props.)}
            placeholder={props.placeHolder}
            type={props.type || 'text'}
          />
          {/* <MaskedInput
            mask={phoneNumberMask}
            {...field}
          /> */}
          <FormErrorMessage>
            <ErrorMessage name={props.name} />
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
