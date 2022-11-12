import { Grid } from '@chakra-ui/react';
import Tile from './tile';

const PuzzleBoard = () => {
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
      <Tile val={1} />
      <Tile val={2} />
      <Tile val={3} />
      <Tile val={4} />
      <Tile val={5} />
      <Tile val={6} />
      <Tile val={7} />
      <Tile val={8} />
      <Tile val={0} />
    </Grid>
  );
};

export default PuzzleBoard;
