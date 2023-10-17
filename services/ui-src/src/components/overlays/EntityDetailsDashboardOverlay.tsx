import { MouseEventHandler, useEffect, useState } from "react";
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
  EntityType,
  FormJson,
  EntityDetailsDashboardOverlayShape,
  EntityDetailsOverlayShape,
  OverlayModalPageShape,
} from "types";
// assets
import arrowLeftBlue from "assets/icons/icon_arrow_left_blue.png";
// verbiage
import { useStore } from "utils";

export const EntityDetailsDashboardOverlay = ({
  closeEntityDetailsOverlay,
  entityType,
  dashboard,
  selectedEntity,
  route,
}: Props) => {
  // Entity provider setup
  const { clearEntities, setSelectedEntity, setEntityType } = useStore();
  const [selectedStep, setSelectedStep] = useState<
    OverlayModalPageShape | EntityDetailsOverlayShape
  >();
  const [stepIsOpen, setIsEntityStepOpen] = useState<boolean>(false);
  const { report } = useStore();

  const { entitySteps } = route;

  //using selectEntity directly will not re-render where there's a data change, we have to use its id to look up date from the report instead
  const reportFieldDataEntities =
    report?.fieldData[entityType!].find(
      (entity: EntityShape) => entity.id === selectedEntity?.id
    ) || [];

  useEffect(() => {
    setSelectedEntity(reportFieldDataEntities);
    setEntityType(entityType);
    return () => {
      clearEntities();
      setSelectedEntity(undefined);
    };
  }, [entityType, reportFieldDataEntities]);

  // Open/Close overlay action methods
  const openEntityStepOverlay = (
    entity: OverlayModalPageShape | EntityDetailsOverlayShape
  ) => {
    setSelectedStep(entity);
    setIsEntityStepOpen(true);
  };

  const closeEntityStepOverlay = () => {
    setSelectedStep(undefined);
    setIsEntityStepOpen(false);
  };

  const tableHeaders = () => {
    return { headRow: ["", "", ""] };
  };

  //EntityRow uses the fieldData to generate, but for this report, we want that information from the steps in the formTemplate
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
        {pageType === "modalOverlay" ? (
          <EntityProvider>
            <OverlayModalPage
              entity={selectedEntity!}
              closeEntityDetailsOverlay={closeEntityStepOverlay}
              route={selectedStep as OverlayModalPageShape}
            />
          </EntityProvider>
        ) : (
          <EntityProvider>
            <EntityDetailsOverlay
              entity={selectedEntity!}
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
            initiativeName={selectedEntity?.initiative_name}
          />
          <Table content={tableHeaders()}>
            {entitySteps?.map((step: any) => (
              <EntityRow
                key={step.id}
                entity={formatEntityStep(reportFieldDataEntities!, step)}
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
              <Button onClick={closeEntityDetailsOverlay as MouseEventHandler}>
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
  entityType?: EntityType;
  dashboard?: FormJson;
  selectedEntity?: EntityShape;
  onSubmit?: Function;
  submitting?: boolean;
  validateOnRender?: boolean;
  route: EntityDetailsDashboardOverlayShape;
}

const sx = {
  overlayContainer: {
    backgroundColor: "palette.white",
    width: "100%",
  },
  backButton: {
    padding: 0,
    fontWeight: "normal",
    color: "palette.primary",
    display: "flex",
    position: "relative",
    right: "3rem",
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
        "&:first-child": {
          fontWeight: "bold",
        },
      },
    },
  },
};
