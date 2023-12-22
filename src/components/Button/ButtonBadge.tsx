import { Badge, Box, Button } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const ButtonBadge = (props: {
  children?: ReactNode;
  baseButtons?: { borderRadius?: number; colorScheme?: string; variant?: string };
  noValue?: 'hidden' | 'light' | 'no-difference';
  valueBadge?: number | string;
  title?: string;
  onClick?: () => void;
}) => {
  const noValue = props.valueBadge === 0;
  return (
    <Box
      pos="relative"
      title={props.title}
    >
      <Button
        {...props.baseButtons}
        fontSize={'1.5em'}
        onClick={props.onClick}
      >
        {props.children}
      </Button>
      {
        <Badge
          hidden={props.noValue === 'hidden' && noValue}
          colorScheme={props.noValue === 'light' && noValue ? 'gray' : 'red'}
          pos="absolute"
          variant="solid"
          bgColor={props.noValue === 'light' && noValue ? 'transparent' : 'red.500'}
          borderRadius={'full'}
          right={0}
          top={0}
        >
          {props.valueBadge}
        </Badge>
      }
    </Box>
  );
};
