// components
import {
  Alert as AlertRoot,
  AlertDescription,
  AlertTitle,
  Box,
  Flex,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
// utils
import { AlertTypes, CustomHtmlElement } from "types";
// assets
import alertIcon from "assets/icons/icon_alert_circle.png";
import { parseCustomHtml } from "utils";

export const Alert = ({
  status = AlertTypes.INFO,
  title,
  description,
  link,
  showIcon = true,
  icon,
  ...props
}: Props) => {
  return (
    <AlertRoot
      status={status}
      variant="left-accent"
      sx={sx.root}
      className={status}
      {...props}
    >
      <Flex>
        {showIcon && (
          <Image src={icon ? icon : alertIcon} sx={sx.icon} alt="Alert" />
        )}
        <Box sx={sx.contentBox} className={!showIcon ? "no-icon" : ""}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && (
            <AlertDescription>
              <Box sx={sx.descriptionText}>{parseCustomHtml(description)}</Box>
              {link && (
                <Text sx={sx.linkText}>
                  <Link href={link} isExternal>
                    {link}
                  </Link>
                </Text>
              )}
            </AlertDescription>
          )}
        </Box>
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
  [key: string]: any;
}

const sx = {
  root: {
    alignItems: "start",
    minHeight: "5.25rem",
    borderInlineStartWidth: "0.5rem",
    marginTop: "1.25rem",
    marginBottom: "1.25rem",
    padding: "1rem",
    "&.info": {
      backgroundColor: "secondary_lightest",
      borderInlineStartColor: "secondary",
    },
    "&.success": {
      bgColor: "success_lightest",
      borderInlineStartColor: "success",
    },
    "&.warning": {
      bgColor: "warn_lightest",
      borderInlineStartColor: "warn",
    },
    "&.error": {
      bgColor: "error_lightest",
      borderInlineStartColor: "error",
    },
  },
  descriptionText: {
    marginTop: ".25rem",
    p: {
      marginY: ".5rem",
    },
    ul: {
      paddingLeft: "1rem",
    },
  },
  linkText: {
    marginTop: ".25rem",
    marginBottom: ".25rem",
  },
  icon: {
    position: "absolute",
    color: "base",
    marginBottom: "1.75rem",
    width: "1.375rem",
  },
  contentBox: {
    marginLeft: "2rem",
    "&.no-icon": {
      marginLeft: 0,
    },
  },
};
