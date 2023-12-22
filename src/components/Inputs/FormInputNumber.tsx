import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import './Input.sass';

export default function FormInputNumber(props: {
  name: string;
  label?: string;
  placeHolder?: string;
  required: boolean;
  precision?: number;
  step?: number;
  min?: number;
  max?: number;
  helpText?: string;
  help?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Field name={props.name}>
      {({
        field,
        form,
        meta,
      }: FieldProps & {
        form: FormikHelpers<any>;
      }) => (
        <FormControl
          isDisabled={props.disabled}
          isRequired
          isInvalid={!!form.errors[props.name] && !!form.touched[props.name]}
        >
          <FormLabel>
            {props.label}{' '}
            {props.helpText && (
              <Icon
                title={props.helpText}
                as={BsFillInfoCircleFill}
              />
            )}
            {props.help}
          </FormLabel>
          <NumberInput
            value={meta.value}
            placeholder={props.placeHolder}
            defaultValue={meta.initialValue}
            min={props.min}
            precision={props.precision}
            step={props.step}
            onChange={(_, valNum) => form.setFieldValue(field.name, valNum)}
          >
            <NumberInputField {...field} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            <ErrorMessage name={props.name} />
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
