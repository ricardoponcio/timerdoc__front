import {
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { IoIosHelpCircle, IoIosHelpCircleOutline } from 'react-icons/io';

export const HelpUsageBtn = ({ children, ...defaultProps }: ButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hover, onHover] = useState(false);
  const hoveing = (enter: boolean) => {
    if (enter && !hover) {
      onHover(!hover);
      return;
    }
    if (!enter && hover) onHover(!hover);
  };
  return (
    <>
      <Button
        onMouseEnter={() => hoveing(true)}
        onMouseLeave={() => hoveing(false)}
        leftIcon={!hover ? <IoIosHelpCircleOutline /> : <IoIosHelpCircle />}
        borderRadius={'full'}
        p={1}
        iconSpacing={'0'}
        w={'fit-content'}
        onClick={onOpen}
        variant={'outline'}
        {...defaultProps}
      />
      <Drawer
        placement={'right'}
        size={'sm'}
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {defaultProps.title && (
            <DrawerHeader borderBottomWidth="1px">{defaultProps.title}</DrawerHeader>
          )}
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
