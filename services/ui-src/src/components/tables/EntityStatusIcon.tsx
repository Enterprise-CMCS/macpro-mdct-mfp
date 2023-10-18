// components
import { Box, Image, Text } from "@chakra-ui/react";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import unfinishedIconDark from "assets/icons/icon_error_circle.png";
import successIcon from "assets/icons/icon_check_circle.png";
import successIconDark from "assets/icons/icon_check_circle_dark.png";
import closedIcon from "assets/icons/icon_circle-minus-gray.png";

export type EntityStatusType =
  | "complete"
  | "close"
  | boolean
  | undefined
  | "disabled";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const EntityStatusIcon = ({ entityStatus, isPdf }: Props) => {
  const statusIcon = (status: EntityStatusType) => {
    switch (status) {
      case true:
      case "complete":
        return {
          src: isPdf ? successIconDark : successIcon,
          alt: isPdf ? "" : "complete icon",
          style: sx.successText,
          text: "Complete",
        };
      case "close":
        return {
          src: isPdf ? closedIcon : closedIcon,
          alt: isPdf ? "" : "close icon",
          style: sx.successText,
          text: "Close",
        };
      case "disabled":
        return {};
      default:
        return {
          src: isPdf ? unfinishedIconDark : unfinishedIcon,
          alt: isPdf ? "" : "warning icon",
          style: sx.errorText,
          text: "Error",
        };
    }
  };

  let status = statusIcon(entityStatus);

  return (
    <Box sx={isPdf ? sx.containerPdf : sx.container}>
      {
        <>
          <Image
            sx={isPdf ? sx.statusIconPdf : sx.statusIcon}
            src={status.src}
            alt={status.alt}
            boxSize="xl"
          />
          {isPdf && (
            <Text sx={status.style}>
              <b>{status.text}</b>
            </Text>
          )}
        </>
      }
    </Box>
  );
};

interface Props {
  entityStatus: EntityStatusType;
  /**
   * Whether or not icon is appearing on PDF page (used for styling)
   */
  isPdf?: boolean;
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
  errorText: {
    color: "palette.error_darker",
    fontSize: "0.667rem",
  },
  containerPdf: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusIcon: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
  statusIconPdf: {
    marginLeft: "0rem",
    img: {
      maxWidth: "fit-content",
    },
  },
};
