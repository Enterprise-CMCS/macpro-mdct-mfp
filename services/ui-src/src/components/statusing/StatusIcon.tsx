import { Flex, Image, Text } from "@chakra-ui/react";
import { ReportType } from "types";
// assets
import successIcon from "assets/icons/icon_check_circle.png";
import errorIcon from "assets/icons/icon_error_circle_bright.png";
import { assertExhaustive } from "utils/other/typing";

export const StatusIcon = ({
  reportType,
  status,
}: {
  reportType: ReportType;
  status?: boolean;
}) => {
  switch (reportType) {
    case ReportType.SAR:
    case ReportType.WP: {
      if (status) {
        return (
          <Flex sx={sx.status}>
            <Image src={successIcon} alt="Success notification" />
            <Text>Complete</Text>
          </Flex>
        );
      } else if (status === undefined) {
        return <></>;
      } else {
        return (
          <Flex sx={sx.status}>
            <Image src={errorIcon} alt="Error notification" />
            <Text>Error</Text>
          </Flex>
        );
      }
    }
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Statusing icons for '${reportType}' have not been implemented.`
      );
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
