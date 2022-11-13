import React, { useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { List } from 'immutable';
import { SlidingTiles } from '../../../../search';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (puzzle: number[]) => void;
}

const CustomModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [value, setValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const resetAndClose = () => {
    setValue('');
    setErrorMsg('');
    onClose();
  };

  const validatePuzzle = (): number[] => {
    const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const candidatePuzzle = value
      .trim()
      .split('')
      .map((val) => parseInt(val));

    if (candidatePuzzle.length !== tiles.length) throw Error();

    const pool = new Set(tiles);
    candidatePuzzle.forEach((tile) => pool.delete(tile));

    if (pool.size !== 0) throw Error();

    return candidatePuzzle;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    try {
      const validPuzzle = validatePuzzle(); // Throws error if invalid

      const isSolvable = SlidingTiles.isSolvable(List(validPuzzle));
      if (!isSolvable) {
        setErrorMsg('Puzzle is not solvable');
        return;
      }

      onConfirm(validPuzzle);
      resetAndClose();
    } catch {
      setErrorMsg('Invalid puzzle');
    }
  };

  const handleCancelClick = () => {
    resetAndClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Custom Puzzle</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={2}>
          <FormControl isInvalid={errorMsg !== ''}>
            <FormLabel>Enter top down to bottom right e.g. 123456780</FormLabel>
            <Input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {errorMsg && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errorMsg}
              </FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Confirm
          </Button>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
