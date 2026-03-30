import React, { useState } from "react";
import { CreateFinancialReportingModal, DashboardPage } from "components";
import { useDisclosure } from "@chakra-ui/react";
// types
import { AnyObject, ReportType } from "types";
// utils
import { useStore } from "utils";
import { financialReportPeriodsMap } from "./financialReportingLogic";

export const FinancialReportingDashboardPage = () => {
  const {
    state: userState,
    userIsReadOnly,
    userIsAdmin,
  } = useStore().user ?? {};

  // if an admin or a read-only user has selected a state, retrieve it from local storage
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;
  // if a user is an admin or a read-only type, use the selected state, otherwise use their assigned state
  const activeState =
    userIsAdmin || userIsReadOnly ? adminSelectedState : userState;

  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );

  // add/edit program modal disclosure
  const {
    isOpen: createFinancialReportingModalIsOpen,
    onOpen: createFinancialReportingModalOnOpenHandler,
    onClose: createFinancialReportingModalOnCloseHandler,
  } = useDisclosure();
  const openCreateModal = () => createFinancialReportingModalOnOpenHandler();
  const financialReportingModal = (
    <CreateFinancialReportingModal
      activeState={activeState!}
      selectedReport={selectedReport}
      modalDisclosure={{
        isOpen: createFinancialReportingModalIsOpen,
        onClose: createFinancialReportingModalOnCloseHandler,
      }}
      userIsAdmin={userIsAdmin}
    />
  );

  const setModalReport = (report: AnyObject | undefined) => {
    if (report) {
      const formData = {
        ...report,
        formData: {
          reportYear: { label: report.reportYear, value: report.reportYear },
          reportPeriod: {
            label:
              financialReportPeriodsMap[
                report.reportPeriod as keyof typeof financialReportPeriodsMap
              ],
            value: report.reportPeriod,
          },
        },
      };
      setSelectedReport(formData);
      openCreateModal();
      return;
    } else {
      setSelectedReport(undefined);
      openCreateModal();
    }
  };

  const modalBundle: ModalBundle = {
    modal: financialReportingModal,
    setModalReport: setModalReport,
  };

  return (
    <DashboardPage
      reportType={ReportType.FINANCIAL_REPORT}
      showFilter={true}
      modal={modalBundle}
    />
  );
};

export interface ModalBundle {
  modal: React.JSX.Element;
  setModalReport: (report: AnyObject | undefined) => void;
}
