import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldProps, FormikHelpers } from "formik";
import { DocumentCreate } from "../../types/Documets";

export default function FormInputText(props : {name: string, placeHolder?: string, required?: boolean}) {
  return (
    <Field name={props.name}>
      {({
        field,
        form,
        meta,
      }: FieldProps & { form: FormikHelpers<DocumentCreate> }) => (
        <FormControl
          isRequired={props.required}
          isInvalid={!!form.errors.nome && !!form.touched.nome}
        >
          <FormLabel>Nome Documento</FormLabel>
          <Input {...field} placeholder={props.placeHolder} />
          <FormErrorMessage>
            <ErrorMessage name={props.name} />
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
