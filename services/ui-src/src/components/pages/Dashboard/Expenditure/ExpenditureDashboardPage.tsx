import React, { useState } from "react";
import { CreateExpenditureModal, DashboardPage } from "components";
import { useDisclosure } from "@chakra-ui/react";
// types
import { AnyObject, ReportType } from "types";
// utils
import { useStore } from "utils";

export const ExpenditureDashboardPage = () => {
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

  const [selectedReport] = useState<AnyObject | undefined>(undefined);

  // add/edit program modal disclosure
  const {
    isOpen: createExpenditureModalIsOpen,
    onOpen: createExpenditureModalOnOpenHandler,
    onClose: createExpenditureModalOnCloseHandler,
  } = useDisclosure();
  const openCreateModal = () => createExpenditureModalOnOpenHandler();
  const expenditureModal = (
    <CreateExpenditureModal
      activeState={activeState!}
      selectedReport={selectedReport!}
      modalDisclosure={{
        isOpen: createExpenditureModalIsOpen,
        onClose: createExpenditureModalOnCloseHandler,
      }}
    />
  );

  const modalBundle: ModalBundle = {
    openModal: openCreateModal,
    modal: expenditureModal,
  };

  return (
    <DashboardPage
      reportType={ReportType.EXPENDITURE}
      showFilter={true}
      modal={modalBundle}
    />
  );
};

export interface ModalBundle {
  openModal: () => void;
  modal: React.JSX.Element;
}
