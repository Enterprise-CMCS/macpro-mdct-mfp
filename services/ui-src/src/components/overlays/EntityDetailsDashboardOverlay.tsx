import { MouseEventHandler, useState } from "react";
// components
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import {
  ReportPageIntro,
  Table,
  EntityRow,
  EntityDetailsOverlay,
  EntityProvider,
  OverlayModalPage,
} from "components";
// types
import {
  EntityShape,
  FormJson,
  EntityDetailsOverlayShape,
  OverlayModalPageShape,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// verbiage

export const EntityDetailsDashboardOverlay = ({
  closeEntityDetailsOverlay,
  dashboard,
  selectedEntity,
  entitySteps,
}: Props) => {
  const [selectedStep, setSelectedStep] = useState<
    OverlayModalPageShape | EntityDetailsOverlayShape
  >();
  const [stepIsOpen, setIsEntityStepOpen] = useState<boolean>(false);

  // Open/Close overlay action methods
  const openEntityStepOverlay = (
    entity: OverlayModalPageShape | EntityDetailsOverlayShape
  ) => {
    setSelectedStep(entity);
    setIsEntityStepOpen(true);
  };

  const closeEntityStepOverlay = () => {
    setIsEntityStepOpen(false);
    setSelectedStep(undefined);
  };

  const tableHeaders = () => {
    return { headRow: ["", "", ""] };
  };

  const reportPageTitle = selectedEntity?.isInitiativeClosed
    ? `[Closed] ${selectedEntity?.initiative_name}`
    : selectedEntity?.initiative_name;

  // EntityRow uses the fieldData to generate, but for this report, we want that information from the steps in the formTemplate
  const formatEntityStep = (entity: EntityShape, step: any) => {
    const newEntity: EntityShape = Object.assign({}, entity);

    (step.stepInfo as []).forEach((info) => {
      newEntity[info] = step[info];
    });

    newEntity["isRequired"] = true;
    return newEntity;
  };

  const openInitiativeStepOverlay = () => {
    const pageType = selectedStep?.pageType;
    return (
      <Box>
        {pageType === "overlayModal" ? (
          // This is page 2 and 3, Evaluation Plan and Funding Sources respectively
          <EntityProvider>
            <OverlayModalPage
              closeEntityDetailsOverlay={closeEntityStepOverlay}
              route={selectedStep as OverlayModalPageShape}
            />
          </EntityProvider>
        ) : (
          // This is page 1 and 4, Define initiative and Close-out respectively
          <EntityProvider>
            <EntityDetailsOverlay
              closeEntityDetailsOverlay={closeEntityStepOverlay}
              route={selectedStep as EntityDetailsOverlayShape}
            />
          </EntityProvider>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {!stepIsOpen ? (
        <Box>
          <Button
            sx={sx.backButton}
            variant="none"
            onClick={closeEntityDetailsOverlay as MouseEventHandler}
            aria-label="Return to all initiatives"
          >
            <Image src={arrowLeftBlue} alt="Arrow left" sx={sx.backIcon} />
            Return to all initiatives
          </Button>
          <ReportPageIntro
            text={dashboard?.verbiage?.intro}
            initiativeName={reportPageTitle}
          />
          <Table sx={sx.table} content={tableHeaders()}>
            {entitySteps?.map((step, index) => (
              <EntityRow
                key={`entityrow-${index}`}
                entity={formatEntityStep(selectedEntity!, step)}
                entityType={step.entityType}
                entityInfo={step.stepInfo}
                verbiage={step.verbiage}
                formEntity={step}
                locked={false}
                openOverlayOrDrawer={() => openEntityStepOverlay(step)}
                openAddEditEntityModal={() => {
                  return;
                }}
                openDeleteEntityModal={() => {
                  return;
                }}
              />
            ))}
          </Table>
          <Box>
            <Flex sx={sx.buttonFlex}>
              <Button
                onClick={closeEntityDetailsOverlay as MouseEventHandler}
                aria-label="Return to all initiatives"
              >
                Return to all initiatives
              </Button>
            </Flex>
          </Box>
        </Box>
      ) : (
        openInitiativeStepOverlay()
      )}
    </Box>
  );
};

interface Props {
  closeEntityDetailsOverlay?: Function;
  dashboard?: FormJson;
  selectedEntity?: EntityShape;
  entitySteps?: (OverlayModalPageShape | EntityDetailsOverlayShape)[];
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
  table: {
    th: {
      fontWeight: "bold",
      color: "palette.gray_medium",
      paddingLeft: "1rem",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      ".tablet &, .mobile &": {
        border: "none",
      },
    },
  },
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: 0,
    ".tablet &": {
      right: "3rem",
    },
    marginBottom: "2rem",
    marginTop: "-2rem",
  },
  backIcon: {
    color: "palette.primary",
    height: "1rem",
    marginRight: "0.5rem",
  },
  footerBox: {
    marginTop: "2rem",
    borderTop: "1.5px solid var(--chakra-colors-palette-gray_light)",
  },
  buttonFlex: {
    justifyContent: "end",
    marginY: "1.5rem",
  },
  saveButton: {
    width: "8.25rem",
  },
  textHeading: {
    fontWeight: "bold",
    lineHeight: "1.25rem",
  },
  programInfo: {
    ul: {
      margin: "0.5rem auto 0 auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        fontSize: "xl",
        lineHeight: "1.75rem",
        "&:first-of-type": {
          fontWeight: "bold",
        },
      },
    },
  },
};
