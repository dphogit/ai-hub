import { Box, Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import { GitHub } from 'react-feather';

const Navbar = () => {
  return (
    <Box
      as="nav"
      bg="white"
      borderBottom={1}
      borderStyle="solid"
      borderColor="gray.200"
      position="fixed"
      width="100%"
    >
      <Flex alignItems="center" maxW="container.xl" px={4} py={4} mx="auto">
        <Heading fontSize="3xl">AI Hub</Heading>
        <Spacer />
        <Link
          href="https://github.com/dphogit/ai-hub"
          target="_blank"
          rel="noreferrer"
        >
          <GitHub size={24} color="black" />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
