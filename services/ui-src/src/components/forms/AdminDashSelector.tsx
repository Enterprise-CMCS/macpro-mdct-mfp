import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form, ReportContext } from "components";
// types
import { AnyObject, FormJson, InputChangeEvent } from "types";
// form
import formJson from "forms/adminDashSelector/adminDashSelector";
// utils
import { useStore } from "utils";

export const AdminDashSelector = ({ verbiage }: Props) => {
  const { clearReportSelection } = useContext(ReportContext);
  const { reportsByState } = useStore();

  const navigate = useNavigate();
  const [reportSelected, setReportSelected] = useState<boolean>(false);

  // add validation to formJson
  const form: FormJson = formJson;

  useEffect(() => {
    if (reportsByState) {
      clearReportSelection();
    }
  }, []);

  const onChange = (event: InputChangeEvent) => {
    if (event.target.name === "report") {
      setReportSelected(true);
    }
  };

  const onSubmit = (formData: AnyObject) => {
    let selectedReport = formData["report"][0].key;
    selectedReport = selectedReport.replace("report-", "").toLowerCase();
    localStorage.setItem("selectedReportType", selectedReport);
    const selectedState = formData["state"].value;
    localStorage.setItem("selectedState", selectedState);
    navigate(`/${selectedReport}`);
  };

  return (
    <Box sx={sx.root} data-testid="read-only-view">
      <Heading as="h1" sx={sx.headerText}>
        {verbiage.header}
      </Heading>
      <Form
        id={form.id}
        formJson={form}
        onSubmit={onSubmit}
        onChange={onChange}
        validateOnRender={false}
        dontReset={false}
      />
      <Flex sx={sx.navigationButton}>
        <Button type="submit" form={formJson.id} isDisabled={!reportSelected}>
          {verbiage.buttonLabel}
        </Button>
      </Flex>
    </Box>
  );
};

interface Props {
  verbiage: AnyObject;
}

const sx = {
  root: {
    ".ds-c-field__hint": {
      fontSize: "md",
      color: "base",
    },
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "normal",
  },
  navigationButton: {
    padding: "1.5rem 0 2rem 0",
  },
};
