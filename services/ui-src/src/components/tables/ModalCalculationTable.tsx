// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
// types
import { FormTable } from "types";
// utils
import { AddCalculationModal } from "components/modals/AddCalculationModal";

export const ModalCalculationTable = ({ disabled, verbiage }: Props) => {
  const {
    isOpen: calculationModalIsOpen,
    onOpen: calculationModalOnOpenHandler,
    onClose: calculationModalOnCloseHandler,
  } = useDisclosure();
  const openModal = () => calculationModalOnOpenHandler();
  const calculationModal = (
    <AddCalculationModal
      modalDisclosure={{
        isOpen: calculationModalIsOpen,
        onClose: calculationModalOnCloseHandler,
      }}
      userIsAdmin={false}
    />
  );

  return (
    <Box sx={sx.box}>
      <Heading as="h2">{verbiage?.title}</Heading>

      <Button
        type="button"
        variant="primary"
        disabled={disabled}
        onClick={openModal}
      >
        {verbiage?.modalButtonText}
      </Button>

      {calculationModal}
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
}

const sx = {
  box: {
    h2: {
      fontSize: "2xl",
      marginBottom: "spacer1",
      marginTop: "spacer4",
      paddingBottom: 0,
    },
  },
};
