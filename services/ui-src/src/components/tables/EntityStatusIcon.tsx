// components
import { Box, Image, Text } from "@chakra-ui/react";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";
import closedIcon from "assets/icons/icon_circle-minus-gray.png";
// types
import { EntityStatuses } from "types";

export type EntityStatusType = EntityStatuses | boolean | undefined;

export const EntityStatusIcon = ({ entityStatus, showLabel }: Props) => {
  const statusIcon = (status: EntityStatusType) => {
    switch (status) {
      case true:
      case EntityStatuses.COMPLETE:
        return {
          src: successIcon,
          alt: showLabel ? "" : "complete icon",
          style: sx.successText,
          text: "Complete",
        };
      case EntityStatuses.CLOSE:
        return {
          src: closedIcon,
          alt: showLabel ? "" : "close icon",
          style: sx.closeText,
          text: "Closed",
        };
      case EntityStatuses.NO_STATUS:
      case EntityStatuses.DISABLED:
        return undefined;
      default:
        return {
          src: unfinishedIcon,
          alt: showLabel ? "" : "warning icon",
          style: sx.errorText,
          text: "Error",
        };
    }
  };

  let status = statusIcon(entityStatus);

  return (
    <Box sx={sx.container}>
      {status && (
        <>
          <Image
            sx={sx.statusIcon}
            src={status.src}
            alt={status.alt}
            boxSize="xl"
          />
          {showLabel && (
            <Text sx={status.style}>
              <b>{status.text}</b>
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

interface Props {
  entityStatus: EntityStatusType;
  showLabel?: boolean;
  [key: string]: any;
}

const sx = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  successText: {
    color: "palette.success_darker",
    fontSize: "0.667rem",
  },
  closeText: {
    color: "palette.gray",
    fontSize: "0.667rem",
  },
  errorText: {
    color: "palette.error_darker",
    fontSize: "0.667rem",
  },
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
