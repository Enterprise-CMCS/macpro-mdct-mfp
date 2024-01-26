// utils
import { AnyObject, ReportType } from "types";
import { Text, Box } from "@chakra-ui/react";

import { useStore } from "utils";
import { notAnsweredText } from "../../constants";

const renderText = (arr: AnyObject[], printVersion?: boolean) => {
  const isFilled = arr.some(
    (data) => data.description || (!data.description && data.conditional)
  );
  const styleBox = printVersion && !isFilled ? sx.notAnsweredBox : sx.box;
  const styleDescription =
    printVersion && !isFilled ? sx.notAnsweredDescription : sx.description;
  return (
    <Box sx={styleBox} data-testid="objective-progress-box">
      {arr.map((data) => {
        if (data.conditonal && !data?.description) return <></>;
        return (
          <>
            <Text sx={sx.subtitle} data-testid={data.testId}>
              {data.subtitle}
            </Text>
            <Text sx={styleDescription}>
              {data?.description || notAnsweredText}
            </Text>
          </>
        );
      })}
    </Box>
  );
};

export const EntityStepCardBottomSection = ({
  stepType,
  entity,
  printVersion,
}: Props) => {
  const { report } = useStore() ?? {};
  switch (stepType) {
    case "evaluationPlan":
      if (report?.reportType === ReportType.SAR) {
        return (
          <>
            {renderText(
              [
                {
                  subtitle:
                    "Performance measure progress toward milestones and key deliverables for current reporting period",
                  description:
                    entity?.objectivesProgress_performanceMeasuresIndicators,
                  testId: "pm-indicators",
                },
              ],
              printVersion
            )}
            {renderText(
              [
                {
                  subtitle:
                    "Were targets for performance measures and/or expected time frames for deliverables met?",
                  description:
                    entity?.objectivesProgress_deliverablesMet?.[0].value,
                  testId: "deliverables-met",
                },
                {
                  subtitle:
                    "Describe progress toward reaching the target/milestone during the reporting period. How close are you to meeting the target? How do you plan to address any obstacle(s) to meeting the target?",
                  description:
                    entity?.objectivesProgress_deliverablesMet_otherText,
                  conditonal: true,
                  testId: "deliverables-other",
                },
              ],
              printVersion
            )}
          </>
        );
      } else {
        return <></>;
      }
    default:
      return <></>;
  }
};

interface Props {
  stepType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  entity?: AnyObject;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

const sx = {
  box: {
    backgroundColor: "#EEFBFF",
    padding: "0.5rem 1rem",
    marginBottom: "1rem",
  },
  description: {
    marginTop: "0.25rem",
    marginBottom: "1.25rem",
    fontSize: "sm",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  notAnsweredBox: {
    backgroundColor: "#FCE8EC",
    padding: "0.5rem 1rem",
    marginBottom: "1rem",
  },
  notAnsweredDescription: {
    marginTop: "0.25rem",
    marginBottom: "1.25rem",
    fontSize: "sm",
    color: "palette.error_darker",
  },
};
