import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Select,
  VStack,
} from '@chakra-ui/react';
import Layout from '../../layout';
import PuzzleBoard from './puzzle-board';

const EightPuzzlePage = () => {
  return (
    <Layout>
      <Center flexDir="column">
        <Heading as="h1" size="2xl" fontWeight="600">
          8 Puzzle Solver
        </Heading>
        <Flex gap={20} mt={20}>
          <PuzzleBoard />
          <VStack spacing={10}>
            <FormControl>
              <FormLabel>Algorithm</FormLabel>
              <Select placeholder="Choose an Algorithm">
                <option>A*</option>
                <option>IDA*</option>
                <option>Greedy</option>
                <option>Uniform Cost</option>
                <option>BFS</option>
              </Select>
            </FormControl>
            <FormControl as="fieldset">
              <FormLabel as="legend">Heuristic</FormLabel>
              <RadioGroup>
                <HStack spacing={10}>
                  <Radio>Manhattan Distance</Radio>
                  <Radio>Misplaced Tiles</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <ButtonGroup
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              w="100%"
            >
              <Button>Custom</Button>
              <Button>Scramble</Button>
              <Button>Solve</Button>
            </ButtonGroup>
          </VStack>
        </Flex>
      </Center>
    </Layout>
  );
};

export default EightPuzzlePage;
