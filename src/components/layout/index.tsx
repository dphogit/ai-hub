import React from 'react';
import { Container } from '@chakra-ui/react';
import Navbar from './navbar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <Container maxW="container.xl" px={4} pt={24} mx="auto">
        {children}
      </Container>
    </>
  );
};

export default Layout;
