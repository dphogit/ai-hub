import { Box, Image, Link, Text } from '@chakra-ui/react';

interface Props {
  heading: string;
  route: string;
  image: {
    src: string;
    alt: string;
  };
}

const FeatureCard = ({ heading, image, route }: Props) => {
  return (
    <Link href={route} _hover={{ textDecoration: 'none' }}>
      <Box
        boxShadow="lg"
        rounded="md"
        w="300px"
        p={4}
        transition="all 0.25s ease-out"
        _hover={{ bg: 'gray.50', transform: 'scale(1.01)' }}
      >
        <Image
          boxSize="100%"
          objectFit="cover"
          src={image.src}
          alt={image.alt}
          mb={4}
        />
        <Text as="h2" fontSize="2xl" fontWeight="500" align="center">
          {heading}
        </Text>
      </Box>
    </Link>
  );
};

export default FeatureCard;
