import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import newWpFormJson from "forms/addEditWpReport/newWpReport.json";
import { AnyObject, FormJson, ReportStatus } from "types";
import { useStore } from "utils";
import { States } from "../../constants";

export const AddNewWorkPlanModal = ({
  activeState,
  reportType,
  selectedReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { full_name, userIsAdmin } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form: FormJson = newWpFormJson;

  /**
   * @function: Prepare WP payload
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const prepareWpPayload = (wpReset?: boolean) => {
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
        locked: false,
        previousRevisions: [],
        isReset: wpReset,
      },
      fieldData: {
        submissionName,
        ["targetPopulations"]: targetPopulations,
      },
    };
  };

  /**
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const writeReport = async (formData: any, wpReset?: boolean) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareWpPayload(wpReset);

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

    await fetchReportsByState(reportType, activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      submitting={submitting}
      content={{
        heading: form.heading?.add,
        subheading: form.heading?.subheading,
        actionButtonText: "Start new",
        closeButtonText: "Cancel",
      }}
    >
      <>
        <Form
          data-testid="add-new-wp-form"
          id={form.id}
          formJson={form}
          formData={selectedReport?.formData}
          onSubmit={userIsAdmin ? modalDisclosure.onClose : writeReport}
          validateOnRender={false}
          dontReset={true}
          reportStatus={selectedReport?.status}
        />
      </>
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
