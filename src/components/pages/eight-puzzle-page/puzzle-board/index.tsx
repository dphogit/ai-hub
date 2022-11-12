import { Grid } from '@chakra-ui/react';
import Tile from './tile';

interface Props {
  puzzle: number[];
}

const PuzzleBoard = ({ puzzle }: Props) => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(3, 1fr)"
      height={300}
      width={300}
      gap={0}
      p={3}
      bg="red.900"
      outline="3px solid black"
    >
      {puzzle.map((val) => (
        <Tile key={val} val={val} />
      ))}
    </Grid>
  );
};

export default PuzzleBoard;
