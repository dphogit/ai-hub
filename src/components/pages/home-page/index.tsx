import { Box, Heading, Link, SimpleGrid, Text } from '@chakra-ui/react';
import Layout from '../../layout';
import FeatureCard from './feature-card';
import eightPuzzleSrc from '../../../assets/eight-puzzle.png';
import { ExternalRoutes } from '../../../common/routes';

const HomePage = () => {
  return (
    <Layout>
      <Box textAlign="center" mb={20}>
        <Heading fontWeight={600} as="h1" fontSize="6xl">
          AI Hub
        </Heading>
        <Text color="gray.500" fontSize="lg" mt={4} mb={8}>
          A side project curating demonstrating what I&apos;ve learned about AI.
        </Text>
        <Link
          isExternal
          href={ExternalRoutes.GITHUB}
          bg="blue.500"
          color="white"
          py={2}
          px={4}
          rounded="md"
          fontWeight="500"
          _hover={{ bg: 'blue.600' }}
        >
          View on GitHub
        </Link>
      </Box>
      <SimpleGrid columns={4}>
        <FeatureCard
          heading="8 Puzzle Solver"
          route="/eight-puzzle"
          image={{ src: eightPuzzleSrc, alt: 'Eight Puzzle' }}
        />
      </SimpleGrid>
    </Layout>
  );
};

export default HomePage;
