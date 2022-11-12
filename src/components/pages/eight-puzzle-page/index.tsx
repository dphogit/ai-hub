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
import {
  AStarSearch,
  BreadthFirstSearch,
  GreedySearch,
  IDAStarSearch,
  Puzzle,
  PuzzleAction,
  SlidingTiles,
  UniformCostSearch,
} from '../../../search';
import { List } from 'immutable';
import CustomModal from './custom-modal';
import SearchAlgorithm from '../../../search/algorithms/SearchAlgorithm';

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
  const [puzzle, setPuzzle] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);

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
    const stProblem = new SlidingTiles({
      initialState: List(puzzle),
      goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0]),
    });

    // Get heuristic function
    let heuristicFn:
      | SlidingTiles['manhattanDistanceHeuristic']
      | SlidingTiles['misplacedTilesHeuristic'];
    switch (heuristic) {
      case Heuristics.MANHATTAN:
        heuristicFn = stProblem.manhattanDistanceHeuristic.bind(stProblem);
        break;
      case Heuristics.MISPLACED:
        heuristicFn = stProblem.misplacedTilesHeuristic.bind(stProblem);
        break;
      default:
        heuristicFn = stProblem.manhattanDistanceHeuristic.bind(stProblem);
    }

    // Get search algorithm
    let searchAlgorithm: SearchAlgorithm<Puzzle, PuzzleAction>;
    switch (algo) {
      case Algorithms.BFS:
        searchAlgorithm = new BreadthFirstSearch();
        break;
      case Algorithms.UCS:
        searchAlgorithm = new UniformCostSearch();
        break;
      case Algorithms.A_STAR:
        searchAlgorithm = new AStarSearch(heuristicFn);
        break;
      case Algorithms.IDA_STAR:
        searchAlgorithm = new IDAStarSearch(heuristicFn);
        break;
      case Algorithms.GREEDY:
        searchAlgorithm = new GreedySearch(heuristicFn);
        break;
      default:
        searchAlgorithm = new AStarSearch(heuristicFn);
    }

    setIsSolving(true);
    const solution = searchAlgorithm.findSolution(stProblem);
    setIsSolving(false);

    if (solution) {
      const solutionPath = [...solution.path()];
      const intervalId = setInterval(() => {
        const node = solutionPath.shift();
        if (node) {
          setPuzzle(node.state.toArray());
        } else {
          clearInterval(intervalId);
        }
      }, 200);
    }
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
                <Button onClick={handleSolveClick} colorScheme="blue">
                  Solve
                </Button>
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
