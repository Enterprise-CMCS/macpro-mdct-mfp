// components
import { Card } from "components";
import { Box, Image, Text } from "@chakra-ui/react";
// utils
import {
  AnyObject,
  EntityShape,
  HeadingLevel,
  OverlayModalStepTypes,
} from "types";
// assets
import completedIcon from "assets/icons/icon_check_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";
import { fillEmptyQuarters } from "utils";
import { ObjectiveProgressEntity } from "components/cards/ObjectiveProgressEntity";
import { EvaluationPlanEntity } from "components/cards/EvaluationPlanEntity";
import { FundingSourcesEntity } from "components/cards/FundingSourcesEntity";

export const ExportedEntityStepCard = ({
  entityIndex,
  entityTotal,
  stepType,
  formattedEntityData,
  hasBoxShadow,
  hasBorder,
  headingLevel = "h2",
  ...props
}: Props) => {
  let entityCompleted = false;
  const entitiesCount = `${entityIndex + 1} / ${entityTotal}`;
  // any drawer-based field will do for this check
  let cardContent = <></>;

  switch (stepType) {
    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
      entityCompleted = formattedEntityData.objectiveName;
      entityCompleted = formattedEntityData.performanceMeasureProgress;

      cardContent = (
        <ObjectiveProgressEntity
          formattedEntityData={formattedEntityData}
          entityCompleted={entityCompleted}
          headingLevel={headingLevel}
        />
      );
      break;
    case OverlayModalStepTypes.EVALUATION_PLAN:
      entityCompleted = formattedEntityData.objectiveName;
      if (entityCompleted && formattedEntityData.includesTargets === "Yes") {
        entityCompleted = formattedEntityData.quarters.length === 12;
        if (formattedEntityData.quarters)
          formattedEntityData.quarters = fillEmptyQuarters(
            formattedEntityData.quarters
          );
      }

      cardContent = (
        <EvaluationPlanEntity
          formattedEntityData={formattedEntityData}
          headingLevel={headingLevel}
        />
      );
      break;
    case OverlayModalStepTypes.FUNDING_SOURCES:
      entityCompleted =
        formattedEntityData.fundingSource &&
        formattedEntityData.quarters.length === 12;
      if (formattedEntityData.quarters)
        formattedEntityData.quarters = fillEmptyQuarters(
          formattedEntityData.quarters
        );

      cardContent = (
        <FundingSourcesEntity
          formattedEntityData={formattedEntityData}
          headingLevel={headingLevel}
        />
      );
      break;
    default:
      cardContent;
      break;
  }

  const boxShadow = hasBoxShadow ? "0px 3px 9px rgba(0, 0, 0, 0.2)" : "none";
  const border = hasBorder ? "1px" : "none";
  const borderColor = hasBorder ? "palette.gray_light" : "none";

  return (
    <Card
      {...props}
      marginTop="2rem"
      boxShadow={boxShadow}
      border={border}
      borderColor={borderColor}
      data-testid="exportedEntityCard"
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
        {cardContent}
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
  reportButton: {
    fontWeight: "bold",
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
