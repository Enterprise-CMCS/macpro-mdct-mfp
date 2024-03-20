import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import newWpFormJson from "forms/addEditWpReport/newWpReport.json";
import { AnyObject, FormJson, ReportStatus } from "types";
import { injectFormWithReportPeriodYears, useStore } from "utils";
import { States } from "../../constants";

export const AddNewWorkPlanModal = ({
  activeState,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { full_name, userIsAdmin } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * @function: Generate report year choices
   * Populate previous, current, and next year for the choice list,
   * except if it is the first year of the work plan feature
   */
  const generateReportYearChoices = () => {
    const WP_LAUNCH_YEAR = 2024;
    const currentYear = new Date(Date.now()).getFullYear();
    let yearList = [];

    if (currentYear === WP_LAUNCH_YEAR) {
      yearList = [
        {
          label: `${currentYear}`,
          id: `reportYear-${currentYear}`,
          value: `${currentYear}`,
        },
        {
          label: `${currentYear + 1}`,
          id: `reportYear-${currentYear + 1}`,
          value: `${currentYear + 1}`,
        },
      ];
    } else {
      yearList = [
        {
          label: `${currentYear - 1}`,
          id: `reportYear-${currentYear - 1}`,
          value: `${currentYear - 1}`,
        },
        {
          label: `${currentYear}`,
          id: `reportYear-${currentYear}`,
          value: `${currentYear}`,
        },
        {
          label: `${currentYear + 1}`,
          id: `reportYear-${currentYear + 1}`,
          value: `${currentYear + 1}`,
        },
      ];
    }

    return yearList;
  };

  const modalFormJson = injectFormWithReportPeriodYears(
    newWpFormJson,
    generateReportYearChoices()
  );
  const form: FormJson = modalFormJson;

  /**
   * @function: Prepare WP payload
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const prepareWpPayload = (formData: any, wpReset?: boolean) => {
    const submissionName = "Work Plan";
    const formattedReportYear = Number(formData.reportPeriodYear[0].value);
    const formattedReportPeriod =
      formData.reportPeriod[0].key === "reportPeriod-1" ? 1 : 2;

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
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
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
    const dataToWrite = prepareWpPayload(formData, wpReset);

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
          onSubmit={userIsAdmin ? modalDisclosure.onClose : writeReport}
          validateOnRender={false}
          dontReset={true}
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
