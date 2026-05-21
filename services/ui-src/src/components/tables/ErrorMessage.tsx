import { ReactNode } from "react";
// components
import { Flex, Image, Text } from "@chakra-ui/react";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const ErrorMessage = ({ id, message }: Props) => {
  if (!message) return null;

  return (
    <Flex
      aria-atomic="true"
      aria-live="assertive"
      as="p"
      className="ds-c-inline-error"
      id={id}
      sx={sx.errorMessage}
    >
      <Image alt="" src={unfinishedIcon} sx={sx.icon} />
      <Text as="span" className="ds-u-visibility--screen-reader">
        Error:{" "}
      </Text>
      {message}
    </Flex>
  );
};

interface Props {
  id: string;
  message?: ReactNode;
}

const sx = {
  errorMessage: {
    alignItems: "center",
  },
  icon: {
    height: "1rem",
    marginRight: "0.375rem",
    width: "1rem",
  },
};
