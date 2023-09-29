// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
import { ReportPageIntro } from "components";
// types
import { EntityDetailsModalOverlayShape } from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
import { MouseEventHandler } from "react";

export const EntityDetailsModalOverlay = ({
  route,
  closeEntityDetailsOverlay,
}: Props) => {
  const submitting = false;
  const { modalForm, verbiage } = route;

  // Add/edit entity modal disclosure and methods

  return (
    <Box>
      <Button
        sx={sx.backButton}
        variant="none"
        onClick={closeEntityDetailsOverlay as MouseEventHandler}
        aria-label="Return to dashboard for this initiative"
      >
        <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
        Return to dashboard for this initiative
      </Button>
      {verbiage.intro && (
        <ReportPageIntro
          sx={sx.intro}
          text={verbiage.intro}
          accordion={verbiage.accordion}
        />
      )}
      <Box sx={sx.footerBox}>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={modalForm.id} sx={sx.saveButton}>
            {submitting ? <Spinner size="md" /> : "Save & return"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: EntityDetailsModalOverlayShape;
  closeEntityDetailsOverlay?: Function;
  validateOnRender?: boolean;
}

const sx = {
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  intro: {
    color: "#5B616B",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  warningBanner: {
    marginTop: "3.5rem",
    marginBottom: "2rem",
    bgColor: "palette.warn_lightest",
    borderInlineStartColor: "palette.warn",
  },
  warningIcon: {
    width: "1.375rem",
  },
};
