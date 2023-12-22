import { FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldProps, FormikHelpers } from "formik";

export default function FormInputTextArea(props : {name: string, label?: string, placeHolder?: string, required?: boolean, rows?: number}) {
  return (
    <Field name={props.name}>
      {({
        field,
        form,
        meta,
      }: FieldProps & { form: FormikHelpers<any> }) => (
        <FormControl
          isRequired={props.required}
          isInvalid={!!form.errors[props.name] && !!form.touched[props.name]}
        >
          { props.label && <FormLabel>{props.label}</FormLabel>}
          <Textarea rows={props.rows} {...field} placeholder={props.placeHolder} />
          <FormErrorMessage>
            <ErrorMessage name={props.name} />
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
