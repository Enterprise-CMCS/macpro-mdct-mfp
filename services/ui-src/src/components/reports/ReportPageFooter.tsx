// components
import { Box, Button, Flex, Image, Spinner } from "@chakra-ui/react";
// utils
import { FormJson } from "types";
// assets
import nextIcon from "assets/icons/icon_next_white.png";
import previousIcon from "assets/icons/icon_previous_blue.png";

export const ReportPageFooter = ({ submitting, form, ...props }: Props) => {
  const hidePrevious = false;
  const formIsDisabled = false;

  return (
    <Box sx={sx.footerBox} {...props}>
      <Box>
        <Flex sx={hidePrevious ? sx.floatButtonRight : sx.buttonFlex}>
          {!hidePrevious && (
            <Button
              onClick={() => {}}
              variant="outline"
              leftIcon={
                <Image src={previousIcon} alt="Previous" sx={sx.arrowIcon} />
              }
            >
              Previous
            </Button>
          )}
          {!form?.id || formIsDisabled ? (
            <Button
              onClick={() => {}}
              rightIcon={
                submitting ? (
                  <></>
                ) : (
                  <Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />
                )
              }
            >
              Continue
            </Button>
          ) : (
            <Button
              form={form.id}
              type="submit"
              sx={sx.button}
              rightIcon={
                !submitting ? (
                  <Image src={nextIcon} alt="Next" sx={sx.arrowIcon} />
                ) : undefined
              }
            >
              {submitting ? <Spinner size="sm" /> : "Continue"}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  form?: FormJson;
  submitting?: boolean;
  [key: string]: any;
}

const sx = {
  footerBox: {
    marginTop: "3.5rem",
  },
  buttonFlex: {
    justifyContent: "space-between",
    marginY: "1.5rem",
  },
  floatButtonRight: {
    justifyContent: "right",
    marginY: "1.5rem",
  },
  arrowIcon: {
    width: "1rem",
  },
  button: {
    width: "8.25rem",
  },
};
