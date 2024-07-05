// components
import { Card } from "components";
import { Box, Button, Image, Text } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  EntityShape,
  HeadingLevel,
  OverlayModalStepTypes,
  ReportType,
} from "types";
// assets
import { svgFilters } from "styles/theme";
import completedIcon from "assets/icons/icon_check_circle.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";
import { fillEmptyQuarters, useStore } from "utils";
import { ObjectiveProgressCard } from "components/cards/ObjectiveProgressCard";
import { EvaluationPlanCard } from "components/cards/EvaluationPlanCard";
import { FundingSourcesCard } from "components/cards/FundingSourcesCard";

export const ExportedEntityStepCard = ({
  entity,
  entityIndex,
  entityTotal,
  stepType,
  formattedEntityData,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openDrawer,
  hasBoxShadow,
  hasBorder,
  ...props
}: Props) => {
  let entityCompleted = false;
  const entitiesCount = `${entityIndex + 1} / ${entityTotal}`;
  const { report } = useStore() ?? {};
  // any drawer-based field will do for this check
  switch (stepType) {
    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
      entityCompleted = formattedEntityData?.objectiveName;
      entityCompleted = formattedEntityData?.performanceMeasureProgress;
      break;
    case OverlayModalStepTypes.EVALUATION_PLAN:
      entityCompleted = formattedEntityData?.objectiveName;
      if (entityCompleted && formattedEntityData?.includesTargets === "Yes") {
        entityCompleted = formattedEntityData?.quarters.length === 12;
        if (formattedEntityData?.quarters)
          formattedEntityData.quarters = fillEmptyQuarters(
            formattedEntityData?.quarters
          );
      }
      break;
    case OverlayModalStepTypes.FUNDING_SOURCES:
      entityCompleted =
        formattedEntityData?.fundingSource &&
        formattedEntityData?.quarters.length === 12;
      if (formattedEntityData?.quarters)
        formattedEntityData.quarters = fillEmptyQuarters(
          formattedEntityData?.quarters
        );
      break;
    default:
      break;
  }

  let cardContent = {};
  switch (stepType) {
    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
      cardContent = (
        <ObjectiveProgressCard
          formattedEntityData={formattedEntityData}
          verbiage={verbiage}
          entityCompleted={entityCompleted}
        />
      );
      break;
    case OverlayModalStepTypes.EVALUATION_PLAN:
      cardContent = (
        <EvaluationPlanCard
          formattedEntityData={formattedEntityData}
          entityCompleted={entityCompleted}
        />
      );
      break;
    case OverlayModalStepTypes.FUNDING_SOURCES:
      cardContent = (
        <FundingSourcesCard
          formattedEntityData={formattedEntityData}
          entityCompleted={entityCompleted}
        />
      );
      break;
    default:
      break;
  }

  const boxShadow = hasBoxShadow ? "0px 3px 9px rgba(0, 0, 0, 0.2)" : "none";
  const border = hasBorder ? "1px" : "none";
  const borderColor = hasBorder ? "palette.gray_light" : "none";
  const addEditEntitybutton = () => {
    if (
      (openAddEditEntityModal && report?.reportType === ReportType.WP) ||
      (openAddEditEntityModal &&
        report?.reportType === ReportType.SAR &&
        entityCompleted)
    ) {
      return (
        <Button
          variant="outline"
          size="sm"
          sx={sx.editButton}
          leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
          onClick={() => openAddEditEntityModal(entity)}
        >
          {props?.disabled
            ? verbiage.readOnlyEntityButtonText
            : verbiage.editEntityButtonText}
        </Button>
      );
    } else if (
      openAddEditEntityModal &&
      report?.reportType === ReportType.SAR &&
      !entityCompleted
    ) {
      return (
        <Button
          data-testid="report-button"
          size="md"
          sx={sx.reportButton}
          onClick={() => openAddEditEntityModal(entity)}
        >
          {verbiage.reportProgressButtonText}
        </Button>
      );
    } else {
      return;
    }
  };

  return (
    <Card
      {...props}
      marginTop="2rem"
      boxShadow={boxShadow}
      border={border}
      borderColor={borderColor}
      data-testid="entityCard"
    >
      <Box sx={sx.contentBox} className={"export-version"}>
        <Text sx={sx.entitiesCount} data-testid="entities-count">
          {entitiesCount}
        </Text>
        <Box
          className={
            entityCompleted ? "icon-div-complete" : "icon-div-incomplete"
          }
          data-testid="print-status-indicator"
        >
          <Image
            src={entityCompleted ? completedIcon : unfinishedIcon}
            alt={`entity is ${entityCompleted ? "complete" : "incomplete"}`}
            sx={sx.exportVersionIcon}
          />
          {entityCompleted ? (
            <Text className="completed-text">Complete</Text>
          ) : (
            <Text className="error-text">Error</Text>
          )}
        </Box>

        {openDeleteEntityModal && report?.reportType === ReportType.WP && (
          <button
            type="button"
            className="delete-entity-button"
            onClick={() => openDeleteEntityModal(entity)}
            data-testid="delete-entity-button"
            aria-label="Delete"
          >
            <Image
              src={deleteIcon}
              alt={verbiage.deleteEntityButtonAltText}
              sx={sx.deleteButtonImage}
            />
          </button>
        )}
        {cardContent}
        {addEditEntitybutton()}
        {openDrawer && (
          <Button
            size="sm"
            sx={entityCompleted ? sx.editButton : sx.openDrawerButton}
            variant={entityCompleted ? "outline" : "primary"}
            onClick={() => openDrawer(entity)}
            data-testid={
              entityCompleted ? "edit-details-button" : "enter-details-button"
            }
            leftIcon={
              entityCompleted ? (
                <Image src={editIcon} alt="edit icon" height="1rem" />
              ) : undefined
            }
          >
            {entityCompleted
              ? verbiage.editEntityDetailsButtonText
              : verbiage.enterEntityDetailsButtonText}
          </Button>
        )}
      </Box>
    </Card>
  );
};

interface Props {
  entity: EntityShape;
  entityIndex: number;
  entityTotal?: number;
  stepType: string;
  formattedEntityData: AnyObject;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openDrawer?: Function;
  hasBoxShadow?: boolean;
  hasBorder?: boolean;
  headingLevel?: HeadingLevel;
  [key: string]: any;
}

const sx = {
  contentBox: {
    position: "relative",
    marginX: "1.25rem",
    "&.export-version": {
      paddingLeft: "2.5rem",
    },
    ".delete-entity-button": {
      position: "absolute",
      right: "-2rem",
      height: "1.5rem",
      width: "1.5rem",
      ".mobile &": {
        right: "-1.5rem",
      },
    },
    ".icon-div-complete": {
      position: "absolute",
      top: "0.25rem",
      left: "-1.5rem",
      marginLeft: "-0.75rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".icon-div-incomplete": {
      position: "absolute",
      top: "0.25rem",
      left: "-1.5rem",
      marginLeft: "-0.25rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".error-text": {
      color: "palette.error_darker",
      fontSize: ".75rem",
      textAlign: "center",
      fontWeight: "bold",
    },
    ".completed-text": {
      color: "green",
      fontSize: ".75rem",
      textAlign: "center",
      fontWeight: "bold",
    },
  },
  exportVersionIcon: {
    height: "1rem",
    margin: "0 auto",
  },
  statusIcon: {
    position: "absolute",
    left: "-2rem",
    height: "1rem",
    ".mobile &": {
      left: "-1.5rem",
    },
  },
  deleteButtonImage: {
    _hover: {
      filter: svgFilters.primary_darker,
    },
  },
  editButton: {
    marginY: "1rem",
    fontWeight: "normal",
    borderColor: "palette.gray_light",
  },
  reportButton: {
    fontWeight: "bold",
  },
  openDrawerButton: {
    marginTop: "1rem",
    fontWeight: "normal",
  },
  entitiesCount: {
    position: "absolute",
    right: "-2rem",
    fontSize: ".75rem",
    fontWeight: "bold",
    color: "#71767a",
    ".mobile &": {
      right: "-1.5rem",
    },
  },
};
