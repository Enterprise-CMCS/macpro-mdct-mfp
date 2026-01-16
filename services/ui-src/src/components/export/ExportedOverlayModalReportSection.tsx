// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { ExportedEntityStepCard } from "./ExportedEntityStepCard";
// types
import {
  AnyObject,
  EntityShape,
  FormField,
  FormLayoutElement,
  HeadingLevel,
  OverlayModalPageShape,
} from "types";
// utils
import { getFormattedEntityData, getReportVerbiage } from "utils";

export const ExportedOverlayModalReportSection = ({
  section: { verbiage },
  entity,
  entityStep,
  headingLevel = "h4",
}: Props) => {
  const { exportVerbiage } = getReportVerbiage();
  const { emptyEntityMessage, dashboardTitle } = exportVerbiage;

  const type = (entityStep as any)?.stepType || (entityStep![0] as string);
  const title = (entityStep as any)?.name || (entityStep![1] as string);
  const hint = (entityStep as any)?.hint || (entityStep![2] as string);
  const entityCount = entity?.[type]?.length;

  let info: string = "";
  ((entityStep as any)?.verbiage?.intro?.info as [])?.forEach(
    (text: AnyObject) => {
      info += `${text?.content} `;
    }
  );
  return (
    <Box mt="2rem" data-testid="exportedOverlayModalPage" sx={sx.container}>
      <Heading as={headingLevel} sx={sx.stepName}>
        {title}
      </Heading>
      <Box sx={sx.stepHint}>{info || hint}</Box>
      <Box sx={sx.dashboardTitle} data-testid="headerCount">
        {entityCount > 0 ? (
          `${
            dashboardTitle[type as keyof typeof dashboardTitle]
          } ${entityCount}`
        ) : (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[type as keyof typeof emptyEntityMessage]}
          </Text>
        )}
      </Box>
      {entity?.[type]?.map((step: any, index: number) => {
        const currentLevel = parseInt(headingLevel.charAt(1), 10);
        const nextLevel = currentLevel + 1;
        const nextHeadingLevel = `h${nextLevel}`;

        return (
          <ExportedEntityStepCard
            key={`${entity.id}${index}`}
            entity={step}
            entityIndex={index}
            entityTotal={entityCount}
            stepType={type!}
            formattedEntityData={getFormattedEntityData(type, step)}
            verbiage={verbiage}
            hasBorder={true}
            headingLevel={nextHeadingLevel as HeadingLevel}
          />
        );
      })}
    </Box>
  );
};

export interface Props {
  section: OverlayModalPageShape;
  entity?: EntityShape;
  entityStep?: (string | FormLayoutElement | FormField)[];
  headingLevel?: HeadingLevel;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "error_darker",
    marginTop: "spacer1",
  },
  dashboardTitle: {
    margin: "2rem auto 1.5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
  },
  stepName: {
    fontSize: "lg",
    paddingBottom: "0.75rem",
  },
  stepHint: {
    fontSize: "md",
    fontWeight: "normal",
    color: "gray_dark",
    lineHeight: "1.5rem",
  },
};
