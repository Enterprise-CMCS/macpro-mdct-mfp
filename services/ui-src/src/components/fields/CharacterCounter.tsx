// components
import { Image, Text } from "@chakra-ui/react";
// assets
import errorIcon from "assets/icons/icon_error_circle.png";

export const CharacterCounter = ({ id, input = "", maxLength }: Props) => {
  const displayMessage = (input: string, maxLength: number) => {
    const pluralize = (count: number) => {
      return [1, -1].includes(count) ? "" : "s";
    };

    if (!input) return `${maxLength} character${pluralize(maxLength)} allowed`;

    const remaining = maxLength - input.length;
    const text = `${Math.abs(remaining)} character${pluralize(remaining)}`;

    if (remaining > -1) return `${text} left`;

    return (
      <>
        <Image src={errorIcon} alt="" sx={sx.errorIcon} />
        <Text as="span" sx={sx.overLimit}>
          {text} over limit
        </Text>
      </>
    );
  };

  return (
    <Text id={id} sx={sx.characterCounter}>
      {displayMessage(input, maxLength)}
    </Text>
  );
};

interface Props {
  id: string;
  input: string;
  maxLength: number;
}

const sx = {
  characterCounter: {
    alignItems: "center",
    display: "flex",
  },
  overLimit: {
    color: "error",
  },
  errorIcon: {
    boxSize: "1rem",
    display: "inline",
    marginRight: "spacer_half",
  },
};
