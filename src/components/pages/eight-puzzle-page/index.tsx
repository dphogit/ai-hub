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
import React, { useState } from 'react';

enum Algorithms {
  BFS = 'BFS',
  A_STAR = 'A*',
  IDA_STAR = 'IDA*',
  UCS = 'UCS',
  GREEDY = 'Greedy',
}

enum Heuristics {
  MANHATTAN = 'Manhattan Distance',
  MISPLACED = 'Misplaced Tiles',
}

const EightPuzzlePage = () => {
  const [algo, setAlgo] = useState<Algorithms>(Algorithms.A_STAR);
  const [heuristic, setHeuristic] = useState<Heuristics>(Heuristics.MANHATTAN);

  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgo(event.target.value as Algorithms);
  };

  const handleHeuristicChange = (value: string) => {
    setHeuristic(value as Heuristics);
  };

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
              <Select value={algo} onChange={handleAlgoChange}>
                <option value={Algorithms.A_STAR}>A*</option>
                <option value={Algorithms.IDA_STAR}>IDA*</option>
                <option value={Algorithms.GREEDY}>Greedy</option>
                <option value={Algorithms.UCS}>Uniform Cost</option>
                <option value={Algorithms.BFS}>BFS</option>
              </Select>
            </FormControl>
            <FormControl as="fieldset">
              <FormLabel as="legend">Heuristic</FormLabel>
              <RadioGroup value={heuristic} onChange={handleHeuristicChange}>
                <HStack spacing={10}>
                  <Radio value={Heuristics.MANHATTAN}>Manhattan Distance</Radio>
                  <Radio value={Heuristics.MISPLACED}>Misplaced Tiles</Radio>
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
