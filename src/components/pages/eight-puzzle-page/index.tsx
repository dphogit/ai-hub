import React, { useEffect, useState } from 'react';
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
import { SlidingTiles } from '../../../search';
import { List } from 'immutable';
import CustomModal from './custom-modal';

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

const scramblePuzzle = (puzzle: number[]): number[] => {
  const shuffled = [...puzzle];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generatePuzzle = (puzzle: number[]) => {
  let isGenerating = true;
  let generated = puzzle; // Keep TS happy
  while (isGenerating) {
    generated = scramblePuzzle(puzzle);
    if (SlidingTiles.isSolvable(List(generated))) {
      isGenerating = false;
    }
  }
  return generated;
};

const EightPuzzlePage = () => {
  const [algo, setAlgo] = useState<Algorithms>(Algorithms.A_STAR);
  const [heuristic, setHeuristic] = useState<Heuristics>(Heuristics.MANHATTAN);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [puzzle, setPuzzle] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);

  useEffect(() => {
    setPuzzle((prevPuzzle) => generatePuzzle(prevPuzzle));
  }, []);

  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgo(event.target.value as Algorithms);
  };

  const handleHeuristicChange = (value: string) => {
    setHeuristic(value as Heuristics);
  };

  const handleSolveClick = () => {
    // TODO: Implement solving
  };

  const handleShuffleClick = () => {
    setPuzzle((prevPuzzle) => generatePuzzle(prevPuzzle));
  };

  const handleCustomClick = () => {
    setIsCustomModalOpen(true);
  };

  const handleCloseCustomModal = () => {
    setIsCustomModalOpen(false);
  };

  const handleConfirmCustomModal = (puzzle: number[]) => {
    setPuzzle(puzzle);
  };

  return (
    <>
      <Layout>
        <Center flexDir="column">
          <Heading as="h1" size="2xl" fontWeight="600">
            8 Puzzle Solver
          </Heading>
          <Flex gap={20} mt={20}>
            <PuzzleBoard puzzle={puzzle} />
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
                    <Radio value={Heuristics.MANHATTAN}>
                      Manhattan Distance
                    </Radio>
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
                <Button colorScheme="blue">Solve</Button>
                <Button onClick={handleShuffleClick}>Shuffle</Button>
                <Button onClick={handleCustomClick}>Custom</Button>
              </ButtonGroup>
            </VStack>
          </Flex>
        </Center>
      </Layout>
      <CustomModal
        isOpen={isCustomModalOpen}
        onClose={handleCloseCustomModal}
        onConfirm={handleConfirmCustomModal}
      />
    </>
  );
};

export default EightPuzzlePage;
