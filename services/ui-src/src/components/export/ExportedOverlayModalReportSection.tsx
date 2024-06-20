// components
import { Box, Heading, Text } from "@chakra-ui/react";
// utils
import { getFormattedEntityData } from "utils";
import {
  AnyObject,
  EntityShape,
  FormField,
  FormLayoutElement,
  OverlayModalPageShape,
} from "types";
import { EntityStepCard } from "components";
// verbiage
import exportVerbiage from "verbiage/pages/wp/wp-export";

export const ExportedOverlayModalReportSection = ({
  section: { verbiage },
  entity,
  entityStep,
  headingLevel = "h4",
}: Props) => {
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
      <Box>
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
      </Box>
      {entity?.[type]?.map((step: any, index: number) => {
        return (
          <EntityStepCard
            key={`${entity.id}${index}`}
            entity={step}
            entityIndex={index}
            entityTotal={entityCount}
            stepType={type!}
            formattedEntityData={getFormattedEntityData(type, step)}
            verbiage={verbiage}
            printVersion
            hasBorder={true}
            level={5}
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
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    margin: "2rem auto 1.5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  stepName: {
    fontSize: "lg",
    paddingBottom: "0.75rem",
  },
  stepHint: {
    fontSize: "md",
    fontWeight: "normal",
    color: "palette.gray_medium_dark",
    lineHeight: "1.5rem",
  },
};
