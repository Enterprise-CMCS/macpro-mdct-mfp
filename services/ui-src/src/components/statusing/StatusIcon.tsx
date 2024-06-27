import { Flex, Image, Text } from "@chakra-ui/react";
// assets
import successIcon from "assets/icons/icon_check_circle.png";
import errorIcon from "assets/icons/icon_error_circle_bright.png";

export const StatusIcon = ({ status }: { status?: boolean }) => {
  switch (status) {
    case true:
      return (
        <Flex sx={sx.status}>
          <Image src={successIcon} alt="Success notification" />
          <Text>Complete</Text>
        </Flex>
      );
    case false:
      return (
        <Flex sx={sx.status}>
          <Image src={errorIcon} alt="Error notification" />
          <Text>Error</Text>
        </Flex>
      );
    default:
      return <></>;
  }
};

const sx = {
  status: {
    gap: "0.5rem",
    alignItems: "center",
    img: {
      width: "1.25rem",
    },
    margin: 0,
    padding: 0,
  },
};
