import { Flex, Image, Text } from "@chakra-ui/react";
// assets
import successIcon from "assets/icons/icon_check_circle.png";
import errorIcon from "assets/icons/icon_error_circle.png";

export const StatusIcon = ({ hideSuccess = false, status }: Props) => {
  switch (status) {
    case true:
      if (hideSuccess) return <></>;
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

interface Props {
  hideSuccess?: boolean;
  status?: boolean;
}

const sx = {
  status: {
    gap: "spacer1",
    alignItems: "center",
    img: {
      width: "1.25rem",
    },
    margin: 0,
    padding: 0,
  },
};
