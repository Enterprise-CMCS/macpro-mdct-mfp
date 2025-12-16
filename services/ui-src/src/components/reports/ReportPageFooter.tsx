import { useNavigate } from "react-router";
// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// utils
import { parseCustomHtml, useFindRoute, useStore } from "utils";
import { AnyObject, FormJson, ReportStatus } from "types";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({ submitting, form, ...props }: Props) => {
  const navigate = useNavigate();
  const { report, editable, selectedEntity } = useStore();
  const { previousRoute, nextRoute } = useFindRoute(
    report?.formTemplate.flatRoutes,
    report?.formTemplate?.basePath
  );
  const hidePrevious = previousRoute === report?.formTemplate?.basePath;

  /*
   * By default, the Continue button submits the form AND navigates.
   * If the form is disabled, the button will navigate only.
   */
  const reportWithSubmittedStatus = report?.status === ReportStatus.SUBMITTED;
  const { userIsAdmin, userIsEndUser } = useStore().user ?? {};
  const formIsDisabled =
    (userIsAdmin && !form?.editableByAdmins) ||
    (userIsEndUser && reportWithSubmittedStatus) ||
    !editable ||
    selectedEntity?.isInitiativeClosed;

  const isReadOnly = !form?.id || formIsDisabled;

  const prevButton = (
    <Button
      onClick={() => navigate(previousRoute)}
      variant="outline"
      leftIcon={<Image src={previousIcon} alt="" sx={sx.arrowIcon} />}
    >
      Previous
    </Button>
  );

  const nextButtonNavOnly = (
    <Button
      onClick={() => navigate(nextRoute)}
      sx={sx.nextButton}
      rightIcon={<Image src={nextIcon} alt="" sx={sx.arrowIcon} />}
    >
      Continue
    </Button>
  );

  const nextButtonSubmit = (
    <Button
      form={form?.id}
      type="submit"
      sx={sx.nextButton}
      rightIcon={
        !submitting ? (
          <Image src={nextIcon} alt="" sx={sx.arrowIcon} />
        ) : undefined
      }
    >
      {submitting ? <Spinner size="sm" /> : "Continue"}
    </Button>
  );

  return (
    <>
      <Flex sx={sx.footerBox}>
        {!hidePrevious ? prevButton : null}
        {isReadOnly ? nextButtonNavOnly : nextButtonSubmit}
      </Flex>
      {props.praDisclosure && (
        <Box sx={sx.praStatement}>{parseCustomHtml(props.praDisclosure)}</Box>
      )}
    </>
  );
};

interface Props {
  form?: FormJson;
  submitting?: boolean;
  [key: string]: any;
  verbiage?: AnyObject;
}

const sx = {
  footerBox: {
    marginTop: "spacer5",
    paddingTop: "spacer3",
    borderTop: "1px solid",
    borderColor: "gray_light",
  },
  nextButton: {
    minWidth: "8.25rem",
    marginLeft: "auto",
  },
  arrowIcon: {
    width: "1rem",
  },
  praStatement: {
    fontSize: "0.875rem",
    marginTop: "spacer2",
  },
};
