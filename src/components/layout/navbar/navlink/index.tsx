import React from 'react';
import { Link } from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  to: string;
}

const NavLink = ({ children, to }: Props) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      fontSize="sm"
      fontWeight="500"
      color="gray.600"
      rounded="md"
      px={3}
      py={1}
      _hover={{ textDecoration: 'none', color: 'gray.800' }}
      _activeLink={{ backgroundColor: 'gray.100' }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
