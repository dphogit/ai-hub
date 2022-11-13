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
  HeuristicFunction,
  Puzzle,
  PuzzleAction,
  SlidingTiles,
  STNode,
  UniformCostSearch,
} from '../../../search';
import { List } from 'immutable';
import CustomModal from './custom-modal';
import SearchAlgorithm from '../../../search/algorithms/SearchAlgorithm';

enum Algorithms {
  BFS = 'BFS',
  A_STAR = 'A*',
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
  const [showHeuristics, setShowHeuristics] = useState<boolean>(true);
  const [puzzle, setPuzzle] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isDisplayingSteps, setIsDisplayingSteps] = useState<boolean>(false);

  useEffect(() => {
    setPuzzle((prevPuzzle) => generatePuzzle(prevPuzzle));
  }, []);

  const getHeuristicFn = (
    stProblem: SlidingTiles,
  ): HeuristicFunction<Puzzle> => {
    switch (heuristic) {
      case Heuristics.MANHATTAN:
        return stProblem.manhattanDistanceHeuristic.bind(stProblem);
      case Heuristics.MISPLACED:
        return stProblem.misplacedTilesHeuristic.bind(stProblem);
      default:
        return stProblem.manhattanDistanceHeuristic.bind(stProblem);
    }
  };

  const getSearchAlgorithm = (
    heuristicFn: HeuristicFunction<Puzzle>,
  ): SearchAlgorithm<Puzzle, PuzzleAction> => {
    switch (algo) {
      case Algorithms.BFS:
        return new BreadthFirstSearch();
      case Algorithms.UCS:
        return new UniformCostSearch();
      case Algorithms.A_STAR:
        return new AStarSearch(heuristicFn);
      case Algorithms.GREEDY:
        return new GreedySearch(heuristicFn);
      default:
        return new AStarSearch(heuristicFn);
    }
  };

  const displaySolutionSteps = (
    solution: STNode<Puzzle, PuzzleAction>,
  ): void => {
    setIsDisplayingSteps(true);
    const solutionPath = [...solution.path()];
    const intervalId = setInterval(() => {
      const node = solutionPath.shift();
      if (node) {
        setPuzzle(node.state.toArray());
      } else {
        clearInterval(intervalId);
        setIsDisplayingSteps(false);
      }
    }, 200);
  };

  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAlgo = event.target.value as Algorithms;
    setAlgo(selectedAlgo);
    const isInformedAlgo =
      selectedAlgo === Algorithms.A_STAR || selectedAlgo === Algorithms.GREEDY;
    setShowHeuristics(isInformedAlgo);
  };

  const handleHeuristicChange = (value: string) => {
    setHeuristic(value as Heuristics);
  };

  const handleSolveClick = () => {
    const stProblem = new SlidingTiles({
      initialState: List(puzzle),
      goalState: List([1, 2, 3, 4, 5, 6, 7, 8, 0]),
    });

    const heuristicFn = getHeuristicFn(stProblem);
    const searchAlgorithm = getSearchAlgorithm(heuristicFn);

    const solution = searchAlgorithm.findSolution(stProblem);
    solution && displaySolutionSteps(solution);
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
              <FormControl w="350px" isDisabled={isDisplayingSteps}>
                <FormLabel>Algorithm</FormLabel>
                <Select value={algo} onChange={handleAlgoChange}>
                  <option value={Algorithms.A_STAR}>A*</option>
                  <option value={Algorithms.GREEDY}>Greedy</option>
                  <option value={Algorithms.UCS}>Uniform Cost</option>
                  <option value={Algorithms.BFS}>BFS</option>
                </Select>
              </FormControl>
              {showHeuristics && (
                <FormControl as="fieldset" isDisabled={isDisplayingSteps}>
                  <FormLabel as="legend">Heuristic</FormLabel>
                  <RadioGroup
                    value={heuristic}
                    onChange={handleHeuristicChange}
                  >
                    <HStack spacing={10}>
                      <Radio value={Heuristics.MANHATTAN}>
                        Manhattan Distance
                      </Radio>
                      <Radio value={Heuristics.MISPLACED}>
                        Misplaced Tiles
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              )}
              <ButtonGroup
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                spacing={8}
                w="100%"
                isDisabled={isDisplayingSteps}
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
