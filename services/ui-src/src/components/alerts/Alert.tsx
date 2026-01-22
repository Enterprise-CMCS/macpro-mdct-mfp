// components
import { Alert as AlertRoot } from "@cmsgov/design-system";
import { Box, Flex, Link } from "@chakra-ui/react";
// types
import { AlertTypes, CustomHtmlElement } from "types";
// utils
import { parseCustomHtml } from "utils";

export const Alert = ({
  status,
  title,
  description,
  link,
  showIcon = true,
}: Props) => {
  return (
    <AlertRoot variation={status} heading={title} hideIcon={!showIcon}>
      <Flex direction={"column"}>
        {description && (
          <Box sx={sx.descriptionText}>{parseCustomHtml(description)}</Box>
        )}
        {link && (
          <Link href={link} isExternal>
            {link}
          </Link>
        )}
      </Flex>
    </AlertRoot>
  );
};

interface Props {
  status?: AlertTypes;
  title?: string;
  description?: string | CustomHtmlElement[];
  link?: string;
  showIcon?: boolean;
}

const sx = {
  descriptionText: {
    p: {
      marginY: "spacer1",
    },
    ul: {
      paddingLeft: "spacer2",
    },
  },
};
