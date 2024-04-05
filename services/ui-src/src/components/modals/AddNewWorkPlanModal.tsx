import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import form from "forms/addEditWpReport/newWpReport.json";
import { AnyObject, ReportStatus } from "types";
import { useStore } from "utils";
import { States, DEFAULT_TARGET_POPULATIONS } from "../../constants";

export const AddNewWorkPlanModal = ({
  activeState,
  reportType,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState } = useContext(ReportContext);
  const { full_name } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * @function: Generate report year choices
   * Populate previous, current, and next year for the choice list,
   * except if it is the first year of the work plan feature
   */
  const generateReportYearChoices = () => {
    const WP_LAUNCH_YEAR = 2024;
    const currentYear = new Date(Date.now()).getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1]
      .filter((year) => year >= WP_LAUNCH_YEAR)
      .map((year) => ({
        id: `reportYear-${year}`,
        label: `${year}`,
        name: `${year}`,
        value: `${year}`,
      }));
  };

  for (let field of form.fields) {
    if (field.id.match("reportPeriodYear")) {
      field.props = {
        ...field.props,
        choices: generateReportYearChoices(),
      };
    }
  }

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

    return {
      metadata: {
        submissionName,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        isReset: wpReset,
        reportYear: formattedReportYear,
        reportPeriod: formattedReportPeriod,
      },
      fieldData: {
        submissionName,
        ["targetPopulations"]: DEFAULT_TARGET_POPULATIONS,
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
      <Form
        data-testid="add-new-wp-form"
        id={form.id}
        formJson={form}
        onSubmit={(formData: Record<string, any>) =>
          writeReport(formData, false)
        }
        validateOnRender={false}
        dontReset={true}
      />
    </Modal>
  );
};

interface Props {
  reportType: string;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  activeState?: string;
  selectedReport?: AnyObject;
}
