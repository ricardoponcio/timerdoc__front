import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Icon } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { useTranslation } from 'react-i18next';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function FormInputDate(props: {
  name: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  backgroundColor?: string;
  errorInTop?: boolean;
  disabled?: boolean;
  helpText?: string;
  minDate?: Date;
}) {
  const { i18n } = useTranslation();
  // const [value, onChange] = useState<Value>(new Date());

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
          <Box
          // position={'relative'}
          >
            {/* <Input
              {...field}
              placeholder={props.placeHolder}
              type={'date'}
            /> */}
            <DatePicker
              {...field}
              className="input-date"
              calendarIcon={<IoCalendarOutline />}
              locale={i18n.language}
              format={i18n.language === 'en-US' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
              value={field.value ? moment(field.value).toDate() : undefined}
              minDate={props.minDate}
              disabled={props.disabled}
              onChange={(date) =>
                form.setFieldValue(
                  field.name,
                  date ? moment(date as Date).format('YYYY-MM-DD') : ''
                )
              }
            />
          </Box>
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
