import { Text } from '@chakra-ui/react';

export default function CardTagsVersion() {
  return (
    <>
      <Text>Enviroment: {import.meta.env.MODE}</Text>
      <Text>tag {import.meta.env.VITE_VERSION || `${import.meta.env.PACKAGE_VERSION}*`}</Text>
      <Text>{JSON.stringify(import.meta.env, null, 2)}</Text>
    </>
  );
}
