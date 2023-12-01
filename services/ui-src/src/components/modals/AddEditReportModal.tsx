import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Button, Spinner } from "@chakra-ui/react";
// form
import wpFormJson from "forms/addEditWpReport/addEditWpReport.json";
import sarFormJson from "forms/addEditSarReport/addEditSarReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { States } from "../../constants";
import { injectFormWithTargetPopulations, useStore } from "utils";

export const AddEditReportModal = ({
  activeState,
  selectedReport,
  previousReport,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { workPlanToCopyFrom } = useStore();

  const dataToInject = selectedReport?.id
    ? selectedReport?.formData?.populations
    : workPlanToCopyFrom?.fieldData?.targetPopulations;

  const modalFormJsonMap: any = {
    WP: wpFormJson,
    SAR: injectFormWithTargetPopulations(
      sarFormJson,
      dataToInject,
      !!selectedReport?.id
    ),
  };

  const modalFormJson = modalFormJsonMap[reportType]!;
  const form: FormJson = modalFormJson;

  // WP report payload
  const prepareWpPayload = () => {
    const submissionName = "Work Plan";

    // static entities
    const targetPopulations = [
      {
        id: "2Vd02CVUtKgBETwqzDXpSIhi",
        transitionBenchmarks_targetPopulationName: "Older adults",
        isRequired: true,
      },
      {
        id: "2Vd02HAezQkxNu2ShmlQONHa",
        transitionBenchmarks_targetPopulationName:
          "Individuals with physical disabilities (PD)",
        transitionBenchmarks_targetPopulationName_short: "PD",
        isRequired: true,
      },
      {
        id: "2Vd02IvLwE59ebYAjfiU7H66",
        transitionBenchmarks_targetPopulationName:
          "Individuals with intellectual and developmental disabilities (I/DD)",
        transitionBenchmarks_targetPopulationName_short: "I/DD",
        isRequired: true,
      },
      {
        id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
        transitionBenchmarks_targetPopulationName:
          "Individuals with mental health and substance use disorders (MH/SUD)",
        transitionBenchmarks_targetPopulationName_short: "MH/SUD",
        isRequired: true,
      },
    ];

    return {
      metadata: {
        submissionName,
        lastAlteredBy: full_name,
        copyFieldDataSourceId: previousReport?.fieldDataId,
        locked: false,
        previousRevisions: [],
      },
      fieldData: {
        submissionName,
        ["targetPopulations"]: targetPopulations,
      },
    };
  };

  // SAR report payload
  const prepareSarPayload = (formData: any) => {
    const submissionName = formData["associatedWorkPlan"];
    const stateOrTerritory = formData["stateOrTerritory"];
    const reportPeriod = formData["reportPeriod"];
    const populations = formData["populations"];
    const finalSar = formData["finalSar"];
    return {
      metadata: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        finalSar,
        populations,
      },
      fieldData: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
      },
    };
  };

  const writeReport = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite =
      reportType === "WP" ? prepareWpPayload() : prepareSarPayload(formData);

    // if an existing program was selected, use that report id
    if (selectedReport?.id) {
      const reportKeys = {
        reportType: reportType,
        state: activeState,
        id: selectedReport.id,
      };
      // edit existing report
      await updateReport(reportKeys, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          locked: undefined,
          status: undefined,
          submissionCount: undefined,
          previousRevisions: undefined,
        },
      });
    } else {
      await createReport(reportType, activeState, {
        ...dataToWrite,
        metadata: {
          ...dataToWrite.metadata,
          reportType,
          status: ReportStatus.NOT_STARTED,
          isComplete: false,
        },
        fieldData: {
          ...dataToWrite.fieldData,
          stateName: States[activeState as keyof typeof States],
          submissionCount: 0,
        },
      });
    }

    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  const resetReport = () => {
    modalDisclosure.onClose();
  };

  const actionButtonText = () => {
    if (reportType === ReportType.WP) {
      return "";
    }
    return submitting ? <Spinner size="md" /> : "Save";
  };

  const isCopyDisabled = () => {
    //if no previous report or the previous report is not approve, disable copy button
    return !previousReport || previousReport?.status !== "Approved";
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: !isCopyDisabled() ? form.heading?.edit : form.heading?.add,
        subheading: !isCopyDisabled()
          ? form.heading?.subheadingEdit
          : form.heading?.subheading,
        actionButtonText: actionButtonText(),
        closeButtonText: "",
      }}
    >
      {(reportType == ReportType.SAR || !isCopyDisabled()) && (
        <Form
          data-testid="add-edit-report-form"
          id={form.id}
          formJson={form}
          formData={
            reportType == ReportType.WP
              ? previousReport
              : selectedReport?.formData
          }
          onSubmit={writeReport}
          validateOnRender={false}
          dontReset={true}
        />
      )}
      {reportType == ReportType.WP && (
        <>
          <Button
            sx={sx.copyBtn}
            disabled={isCopyDisabled()}
            onClick={writeReport}
            type="submit"
          >
            Continue from previous period
          </Button>
          {isCopyDisabled() ? (
            <Button
              sx={sx.close}
              onClick={writeReport}
              type="submit"
              variant="outline"
              data-testid="modal-logout-button"
            >
              Start new
            </Button>
          ) : (
            <Button
              sx={sx.resetBtn}
              onClick={resetReport}
              type="submit"
              variant="outline"
              data-testid="modal-logout-button"
            >
              Reset Work Plan
            </Button>
          )}
        </>
      )}
    </Modal>
  );
};

interface Props {
  activeState?: string;
  reportType: string;
  selectedReport?: AnyObject;
  previousReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}

const sx = {
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "30rem",
    marginX: "4rem",
    padding: "0",
  },
  modalHeader: {
    padding: "2rem 2rem 0 2rem",
  },
  modalBody: {
    padding: "1rem 2rem 0 2rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0 2rem 2rem 2rem",
  },
  copyBtn: {
    justifyContent: "center",
    marginTop: "1rem",
    marginRight: "1rem",
    minWidth: "7.5rem",
    span: {
      marginLeft: "1rem",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
  resetBtn: {
    border: "none",
    marginTop: "1rem",
    fontWeight: "none",
    textDecoration: "underline",
    fontSize: "0.875rem",
  },
  close: {
    justifyContent: "start",
    padding: ".5rem 1rem",
    marginTop: "1rem",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
};
