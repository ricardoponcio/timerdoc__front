import { Box, Flex, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

export default function SkeletonDefault({ noOfLanes = [2, 2, 10] }: { noOfLanes?: number[] }) {
  return (
    <Box
      padding="6"
      boxShadow="lg"
      bg="white"
    >
      {noOfLanes.map((v, i) => (
        <SkeletonText
          key={i}
          mt="4"
          noOfLines={v}
          spacing="6"
          skeletonHeight="4"
        />
      ))}
      <Flex
        mt="6"
        justifyContent={'space-between'}
      >
        <SkeletonCircle boxSize={12} />
        <SkeletonCircle boxSize={12} />
      </Flex>
    </Box>
  );
}
