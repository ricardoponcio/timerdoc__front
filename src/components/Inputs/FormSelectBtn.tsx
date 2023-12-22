import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import { BsFillInfoCircleFill } from 'react-icons/bs';

type Option = {
  value: string;
  label?: string;
  obs?: string;
  disable?: boolean;
  selected?: boolean;
};

type CustonBtn = {
  px?: string | number;
  py?: string | number;
  bg?: string;
  fontWeight?: string;
  fontSize?: string;
};

export default function FormSelectBtn(props: {
  name: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  options?: Option[];
  disabled?: boolean;
  helpText?: string;
  custonField?: CustonBtn;
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
          isRequired={props.required}
          isDisabled={props.disabled}
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
          </FormLabel>
          <Flex gap={2}>
            {props.options?.map((op) => (
              <Button
                key={op.value}
                {...props.custonField}
                onClick={() => form.setFieldValue(field.name, op.value)}
                bg={op.value === form.values[field.name] ? '#0cc' : props.custonField?.bg}
              >
                {op.label}
              </Button>
            ))}
          </Flex>
          {/* <Select
            {...field}
            size="md"
            placeholder={props.placeHolder}
            name={props.name}
            onChange={(event) => form.setFieldValue(field.name, event.target.value)}
          >
            {props.options?.map((v, i) => (
              <option
                key={`${v.value}`}
                value={v.value}
                disabled={v.disable}
              >
                {v.label ? v.label : v.value}
              </option>
            ))}
          </Select> */}
          <FormErrorMessage>
            <ErrorMessage name={props.name} />
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
