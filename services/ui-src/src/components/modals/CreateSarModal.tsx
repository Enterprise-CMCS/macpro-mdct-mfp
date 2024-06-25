import { useContext, useState } from "react";
// components
import { Form, Modal, ReportContext } from "components";
import { Spinner } from "@chakra-ui/react";
// form
import sarFormJson from "forms/addEditSarReport/addEditSarReport.json";
// utils
import { AnyObject, FormJson, ReportStatus, ReportType } from "types";
import { States } from "../../constants";
import { injectFormWithTargetPopulations, useStore } from "utils";

const reportType = ReportType.SAR;

export const CreateSarModal = ({
  activeState,
  selectedReport,
  modalDisclosure,
}: Props) => {
  const { createReport, fetchReportsByState, updateReport } =
    useContext(ReportContext);
  const { full_name, userIsAdmin } = useStore().user ?? {};
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { workPlanToCopyFrom } = useStore();

  /**
   * edit modal will be in view-only mode for admins all the time,
   * and for state users after a SAR has been submitted
   */
  const sarReportWithSubmittedStatus =
    selectedReport?.status === ReportStatus.SUBMITTED;

  const viewOnly = userIsAdmin || sarReportWithSubmittedStatus;

  const dataToInject = selectedReport?.id
    ? selectedReport?.formData?.populations
    : workPlanToCopyFrom?.fieldData?.targetPopulations;

  const form: FormJson = injectFormWithTargetPopulations(
    sarFormJson,
    dataToInject,
    !!selectedReport?.id
  );

  // SAR report payload
  const prepareSarPayload = (formData: any) => {
    const submissionName = formData["associatedWorkPlan"];
    const stateOrTerritory = formData["stateOrTerritory"];
    const populations = formData["populations"];
    const finalSar = formData["finalSar"];
    return {
      metadata: {
        submissionName,
        stateOrTerritory,
        lastAlteredBy: full_name,
        locked: false,
        previousRevisions: [],
        finalSar,
        populations,
      },
      fieldData: {
        submissionName,
        stateOrTerritory,
      },
    };
  };

  /**
   * @param wpReset: (optional) determine whether the user would like to continue a Work Plan for next period,
   * but clear / reset any existing data from the previous period
   */
  const writeReport = async (formData: any) => {
    setSubmitting(true);
    const submitButton = document.querySelector("[form=" + form.id + "]");
    submitButton?.setAttribute("disabled", "true");
    const dataToWrite = prepareSarPayload(formData);

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
    return submitting ? <Spinner size="md" /> : viewOnly ? "Return" : "Save";
  };

  return (
    <Modal
      data-testid="create-sar-modal"
      formId={form.id}
      modalDisclosure={modalDisclosure}
      content={{
        heading: selectedReport?.id ? form.heading?.edit : form.heading?.add,
        actionButtonText: actionButtonText(),
        closeButtonText: "",
      }}
    >
      <Form
        data-testid="create-sar-form"
        id={form.id}
        formJson={form}
        formData={selectedReport?.formData}
        // if view-only (user is admin, report is submitted), close modal
        onSubmit={viewOnly ? modalDisclosure.onClose : writeReport}
        validateOnRender={false}
        dontReset={true}
        reportStatus={selectedReport?.status}
      />
    </Modal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  activeState?: string;
  selectedReport?: AnyObject;
}
