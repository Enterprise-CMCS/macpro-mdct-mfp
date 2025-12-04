import { MouseEventHandler } from "react";
// components
import {
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Text,
  Box,
} from "@chakra-ui/react";
import { CloseIcon } from "@cmsgov/design-system";
// utils
import { AnyObject, CustomHtmlElement } from "types";
import { makeMediaQueryClasses, parseCustomHtml, shimComponent } from "utils";

export const Drawer = ({
  verbiage,
  drawerDisclosure,
  children,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const { isOpen, onClose } = drawerDisclosure;

  const CloseIconShim = shimComponent(CloseIcon);

  return (
    <ChakraDrawer
      isOpen={isOpen}
      onClose={() => {}}
      size="full"
      placement="right"
      {...props}
    >
      <DrawerOverlay />
      <DrawerContent sx={sx.drawerContent} className={mqClasses}>
        <DrawerHeader sx={sx.drawerHeader}>
          <Button
            sx={sx.drawerCloseButton}
            leftIcon={<CloseIconShim />}
            variant="transparent"
            onClick={onClose as MouseEventHandler}
          >
            Close
          </Button>
        </DrawerHeader>
        <DrawerBody sx={sx.drawerBody}>
          <Text sx={sx.drawerHeaderText}>{verbiage.drawerTitle}</Text>
          {verbiage.drawerInfo && (
            <Box sx={sx.infoTextBox}>
              {parseCustomHtml(verbiage.drawerInfo)}
            </Box>
          )}
          {children}
        </DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  );
};

interface Props {
  verbiage: {
    drawerTitle: string;
    drawerInfo?: CustomHtmlElement[];
    drawerDetails?: AnyObject;
  };
  drawerDisclosure: {
    isOpen: boolean;
    onClose: Function;
  };
  selectedEntity?: string;
  [key: string]: any;
}

const sx = {
  drawerContent: {
    maxWidth: "90vw",
    padding: "spacer2",
    "&.tablet": {
      maxWidth: "32rem",
    },
    "&.desktop": {
      maxWidth: "36rem",
    },
  },
  drawerHeader: {
    padding: "spacer2",
  },
  drawerHeaderText: {
    paddingRight: "4rem",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  drawerCloseButton: {
    position: "absolute",
    top: "2rem",
    right: "2rem",
    span: {
      margin: "0 0.25rem",
      svg: {
        fontSize: "xs",
        width: "xs",
        height: "xs",
      },
    },
  },
  detailBox: {
    marginTop: "spacer4",
    fontWeight: "normal",
    color: "base",
  },
  detailHeader: {
    marginBottom: "spacer1",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
  },
  detailDescription: {
    marginBottom: "spacer1",
    fontSize: "md",
  },
  infoTextBox: {
    marginTop: "spacer4",
    fontSize: "md",
    fontWeight: "light",
    color: "gray",
    paddingBottom: "0",
    p: {
      marginTop: "spacer2",
    },
    a: {
      color: "primary",
      "&:hover": {
        color: "primary_darker",
      },
    },
  },
  drawerBody: {
    padding: "0 1rem 1rem 1rem",
  },
};
