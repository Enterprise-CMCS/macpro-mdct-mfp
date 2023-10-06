import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Button, Image, Spinner } from "@chakra-ui/react";
// form
import wpFormJson from "forms/addEditWpReport/addEditWpReport.json";
import sarFormJson from "forms/addEditSarReport/addEditSarReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { States } from "../../constants";
import { useStore } from "utils";
// assets
import muteCopyIcon from "assets/icons/icon_copy_gray.png";

export const AddEditReportModal = ({
  activeState,
  selectedReport,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { workPlanToCopyFrom } = useStore();
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const modalFormJsonMap: any = {
    WP: wpFormJson,
    SAR: sarFormJson,
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
        isRequired: true,
      },
      {
        id: "2Vd02IvLwE59ebYAjfiU7H66",
        transitionBenchmarks_targetPopulationName:
          "Individuals with intellectual and developmental disabilities (I/DD)",
        isRequired: true,
      },
      {
        id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
        transitionBenchmarks_targetPopulationName:
          "Individuals with mental health and substance abuse disorders (MH/SUD)",
        isRequired: true,
      },
    ];
    return {
      metadata: {
        submissionName,
        lastAlteredBy: full_name,
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
    return {
      metadata: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        finalSar: formData["finalSar"][0].value === "Yes" ? true : false,
      },
      fieldData: {
        submissionName,
        stateOrTerritory,
        reportPeriod,
        wpData: workPlanToCopyFrom,
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

  const actionButtonText = () => {
    if (reportType === ReportType.WP) {
      return "";
    }
    return submitting ? <Spinner size="md" /> : "Save";
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReport?.id ? form.heading?.edit : form.heading?.add,
        subheading: selectedReport?.id ? "" : form.heading?.subheading,
        actionButtonText: actionButtonText(),
        closeButtonText: "",
      }}
    >
      {reportType == ReportType.WP ? (
        <>
          <Button sx={sx.copyBtn} disabled={true} type="submit">
            Copy from previous
            <Image
              sx={sx.muteCopyIcon}
              src={muteCopyIcon}
              alt="Copy Icon"
              className="copyIcon"
            />
          </Button>
          <Button
            sx={sx.close}
            onClick={writeReport}
            type="submit"
            variant="outline"
            data-testid="modal-logout-button"
          >
            Start new
          </Button>
        </>
      ) : (
        <Form
          data-testid="add-edit-report-form"
          id={form.id}
          formJson={form}
          formData={selectedReport?.formData}
          onSubmit={writeReport}
          validateOnRender={false}
          dontReset={true}
        />
      )}
    </Modal>
  );
};

interface Props {
  activeState?: string;
  reportType: string;
  selectedReport?: AnyObject;
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
  muteCopyIcon: {
    width: "20px",
    marginLeft: "10px",
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
