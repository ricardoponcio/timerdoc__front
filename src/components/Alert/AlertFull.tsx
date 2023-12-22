import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle } from '@chakra-ui/alert';
import { AlertDefaultProps } from 'types/Alert';

export const AlertFull = (props: AlertDefaultProps & AlertProps) => {
  return (
    <Alert
      status={props.type}
      color={props.color || props.type === 'error' ? 'red.300' : undefined}
      borderRadius={5}
      {...props}
      textAlign={'end'}
    >
      <AlertIcon />
      {props.title && <AlertTitle>{props.title}: </AlertTitle>}
      <AlertDescription>{props.msg}</AlertDescription>
    </Alert>
  );
};
