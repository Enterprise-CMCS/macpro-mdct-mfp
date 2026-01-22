import { useRef } from "react";
// components
import { Box, Collapse, SystemStyleObject } from "@chakra-ui/react";
import { Alert } from "components";
// types
import { AlertTypes, ErrorVerbiage } from "types";

export const ErrorAlert = ({ error, sxOverride }: Props) => {
  // Focus the alert when an error is given
  const ref = useRef<HTMLDivElement>(null);
  if (error && ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus({ preventScroll: true });
  }

  return (
    <Box ref={ref} sx={sxOverride}>
      <Collapse in={!!error}>
        {error && (
          <Alert
            status={AlertTypes.ERROR}
            title={error.title}
            description={error.description}
            showIcon={false}
          />
        )}
      </Collapse>
    </Box>
  );
};

interface Props {
  error?: ErrorVerbiage;
  sxOverride?: SystemStyleObject;
}
