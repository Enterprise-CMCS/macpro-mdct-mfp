// components
import { Alert as AlertRoot } from "@cmsgov/design-system";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
// types
import { AlertTypes, CustomHtmlElement } from "types";
// utils
import { parseCustomHtml } from "utils";

export const Alert = ({
  status,
  title,
  children,
  description,
  link,
  showIcon = true,
}: Props) => {
  const content = description ? parseCustomHtml(description) : children;
  return (
    <AlertRoot variation={status} heading={title} hideIcon={!showIcon}>
      <Flex direction={"column"}>
        <Box>
          {content && (
            <>
              <Text sx={sx.descriptionText}>{content}</Text>
              {link && (
                <Link href={link} isExternal>
                  {link}
                </Link>
              )}
            </>
          )}
        </Box>
      </Flex>
    </AlertRoot>
  );
};

interface Props {
  status?: AlertTypes;
  title?: string;
  children?: ReactNode;
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
