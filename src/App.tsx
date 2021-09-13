import React from 'react';
import { ChakraProvider, Heading } from '@chakra-ui/react';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div>
        <Heading>Threshold Token Dashboard</Heading>
      </div>
    </ChakraProvider>
  );
}

export default App;
