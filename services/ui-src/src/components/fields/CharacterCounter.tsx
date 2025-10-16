import { Text } from "@chakra-ui/react";

export const CharacterCounter = ({ id, input = "", maxLength }: Props) => {
  const remainingCharacters = maxLength - input.length;

  return (
    <Text as="span" id={id}>
      {input
        ? `${remainingCharacters} characters left`
        : `${maxLength} characters allowed`}
    </Text>
  );
};

interface Props {
  id: string;
  input: string;
  maxLength: number;
}
