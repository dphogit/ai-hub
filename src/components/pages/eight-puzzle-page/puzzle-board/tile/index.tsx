import { Square } from '@chakra-ui/react';
import { SlidingTiles } from '../../../../../search';

const Tile = ({ val }: { val: number }) => {
  if (val === SlidingTiles.BLANK_TILE) {
    return <Square outline="3px solid black" bg="gray.200" />;
  }

  return (
    <Square
      fontSize="5xl"
      fontWeight="600"
      outline="3px solid black"
      bg="yellow.100"
    >
      {val}
    </Square>
  );
};

export default Tile;
