import { useState } from "react";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  ReportPageIntro,
} from "components";
// assets
import addIcon from "assets/icons/icon_add_white.png";
// types
import { EntityShape, OverlayModalPageShape } from "types";
import { EntityCard } from "components/cards/EntityCard";
import { getFormattedEntityData } from "utils/reports/entities";
import { useStore } from "utils";

export const OverlayModalPage = ({ route }: Props) => {
  const { entityType, verbiage, modalForm } = route;
  const { report } = useStore();
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );

  //display variables
  let reportFieldDataEntities = report?.fieldData[entityType] || [];

  ///TEMPORARY ENTITY//
  let tempEntity = {};
  /*
   *tempEntity = {
   * id: "mockid",
   * evaluationPlan_objectiveName: "{Objective Name}",
   * evaluationPlan_description: "Description here",
   * evaluationPlan_targets: "Targets here",
   * evaluationPlan_includesTargets: "No",
   * evaluationPlan_additionalDetails: "Additional details",
   * };
   */

  tempEntity = {
    objectiveName: "{Funding Sources}",
    id: "test-id",
    report_initiative: "state and territory specific initiatives",
    quarters: [
      {
        id: "2023 Q3",
        value: "$203,090",
      },
      {
        id: "2024 Q3",
        value: "$157,000",
      },
      {
        id: "2025 Q3",
        value: "$35,000",
      },
      {
        id: "2023 Q4",
        value: "$152,230",
      },
      {
        id: "2024 Q4",
        value: "$345,789",
      },
      {
        id: "2025 Q4",
        value: "$250,000",
      },
      {
        id: "2024 Q1",
        value: "$30,010",
      },
      {
        id: "2025 Q1",
        value: "$10,000",
      },
      {
        id: "2026 Q1",
        value: "$30,090",
      },
      {
        id: "2024 Q2",
        value: "$30,010",
      },
      {
        id: "2025 Q2",
        value: "$10,000",
      },
      {
        id: "2026 Q2",
        value: "$30,090",
      },
    ],
    isOtherEntity: true,
  };

  reportFieldDataEntities = [tempEntity, tempEntity];

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = () => {
    setSelectedEntity({
      id: "123",
      name: "mock entity",
    });
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  return (
    <Box>
      {verbiage.intro && (
        <ReportPageIntro
          sx={sx.intro}
          text={verbiage.intro}
          accordion={verbiage.accordion}
        />
      )}
      <Box>
        <Button
          sx={sx.addEntityButton}
          onClick={addEditEntityModalOnOpenHandler}
          leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
        >
          {verbiage.addEntityButtonText}
        </Button>
        <Heading as="h3" sx={sx.dashboardTitle}>
          {`${verbiage.dashboardTitle}: ${reportFieldDataEntities.length}`}
        </Heading>
        <Box>
          {reportFieldDataEntities.map(
            (entity: EntityShape, entityIndex: number) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                entityIndex={entityIndex}
                entityType={entityType}
                verbiage={verbiage}
                formattedEntityData={getFormattedEntityData(entityType, entity)}
                openAddEditEntityModal={openAddEditEntityModal}
                openDeleteEntityModal={openDeleteEntityModal}
              />
            )
          )}
          <Button
            sx={sx.addEntityButton}
            onClick={addEditEntityModalOnOpenHandler}
            leftIcon={<Image sx={sx.buttonIcons} src={addIcon} alt="Add" />}
          >
            {verbiage.addEntityButtonText}
          </Button>
        </Box>
        <hr />
        {/* MODALS */}
        <AddEditEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          form={modalForm}
          modalDisclosure={{
            isOpen: addEditEntityModalIsOpen,
            onClose: closeAddEditEntityModal,
          }}
        />
        <DeleteEntityModal
          selectedEntity={selectedEntity}
          verbiage={verbiage}
          modalDisclosure={{
            isOpen: deleteEntityModalIsOpen,
            onClose: closeDeleteEntityModal,
          }}
        />
      </Box>
      <Box>
        <Flex sx={sx.buttonFlex}>
          <Button type="submit" form={modalForm.id} sx={sx.saveButton}>
            Save & return
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

interface Props {
  route: OverlayModalPageShape;
  validateOnRender?: boolean;
}

const sx = {
  intro: {
    color: "palette.gray_medium",
  },
  buttonIcons: {
    height: "1rem",
  },
  dashboardTitle: {
    paddingTop: "1rem",
    paddingBottom: "0",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
};
