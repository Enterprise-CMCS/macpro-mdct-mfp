import { useEffect, useState } from "react";
// components
import { Button, Input, ModalFooter, Text } from "@chakra-ui/react";
import { Modal } from "components";
// utils
import { getReportVerbiage } from "utils";

export const ArchiveReportModal = ({
  adminState,
  archiveReport,
  fetchReportsByState,
  modalDisclosure,
  reportId,
  reportType,
}: Props) => {
  const [archiveInput, setArchiveInput] = useState<string>("");
  const [isArchivable, setIsArchivable] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const { dashboardVerbiage } = getReportVerbiage(reportType);
  const { modalArchive } = dashboardVerbiage;

  const handleInputVerification = (e: any) => {
    setArchiveInput(e.target.value);
  };

  useEffect(() => {
    const archive = /^\bARCHIVE$\b|^\bArchive$\b|^\barchive$\b/;
    archive.test(archiveInput) ? setIsArchivable(true) : setIsArchivable(false);
  }, [archiveInput]);

  const onConfirmHandler = async () => {
    if (reportId && adminState && reportType && isArchivable) {
      const reportKeys = {
        reportType: reportType,
        state: adminState,
        id: reportId,
      };
      setArchiving(true);
      await archiveReport(reportKeys);
      await fetchReportsByState(reportType, adminState);
      setArchiving(false);
    }

    modalDisclosure.onClose();
  };

  return (
    <Modal
      modalDisclosure={modalDisclosure}
      content={{
        heading: modalArchive.heading,
        closeButtonText: "",
        actionButtonText: "",
      }}
      submitting={archiving}
      submitButtonDisabled={!isArchivable}
    >
      <Text sx={sx.archiveModalBody}>{modalArchive.body}</Text>
      <Text fontWeight="bold">Enter ARCHIVE to confirm.</Text>
      <Input
        id="archive"
        name="archive"
        type="text"
        value={archiveInput}
        onChange={handleInputVerification}
        className="field"
        data-testid="modal-input"
      />
      <ModalFooter sx={sx.modalFooter}>
        <Button
          type="submit"
          variant="outline"
          data-testid="modal-cancel-button"
          sx={sx.modalCancel}
          onClick={() => modalDisclosure.onClose}
        >
          {modalArchive.closeButtonText}
        </Button>
        <Button
          type="submit"
          disabled={!isArchivable}
          data-testid="modal-archive-button"
          data-cy="modal-archive"
          onClick={onConfirmHandler}
        >
          {modalArchive.actionButtonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

interface Props {
  adminState?: string;
  archiveReport: Function;
  fetchReportsByState: Function;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  reportType: string;
  reportId?: string;
}

const sx = {
  archiveModalBody: {
    marginBottom: "spacer2",
  },
  modalFooter: {
    paddingStart: 0,
    justifyContent: "start",
  },
  modalCancel: {
    marginRight: "spacer2",
  },
  ".mobile &": {
    fontSize: "sm",
  },
};
