import { Box, Flex, HStack, Link, Spacer, Text } from '@chakra-ui/react';
import { GitHub } from 'react-feather';
import { NavLink as RouterLink } from 'react-router-dom';
import NavLink from './navlink';
import { ExternalRoutes, PageRoutes } from '../../../common/routes';

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
        <Text fontFamily="heading" as="h2">
          <Link
            as={RouterLink}
            to={PageRoutes.HOME}
            fontWeight="bold"
            _hover={{ textDecoration: 'none' }}
          >
            AI Hub
          </Link>
        </Text>
        <HStack spacing={4} ml={8}>
          <NavLink to={PageRoutes.EIGHT_PUZZLE}>8 Puzzle Solver</NavLink>
        </HStack>
        <Spacer />
        <Link
          href={ExternalRoutes.GITHUB}
          target="_blank"
          rel="noreferrer"
          color="gray.600"
          _hover={{
            color: 'gray.800',
          }}
        >
          <GitHub size={20} />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
