// utils
import { AnyObject, ReportType } from "types";
import { Text, Box } from "@chakra-ui/react";

import { useStore } from "utils";

export const EntityStepCardBottomSection = ({ stepType, entity }: Props) => {
  const { report } = useStore() ?? {};
  switch (stepType) {
    case "evaluationPlan":
      if (report?.reportType === ReportType.SAR) {
        return (
          <>
            <Box
              sx={sx.objectiveProgressBox}
              data-testid="objective-progress-box"
            >
              <Text sx={sx.subtitle}>
                Performance measure progress toward milestones and key
                deliverables for current reporting period
              </Text>
              <Text sx={sx.description}>
                {entity?.objectivesProgress_performanceMeasuresIndicators}
              </Text>
            </Box>
            <Box sx={sx.objectiveProgressBox}>
              <Text sx={sx.subtitle}>
                Were targets for performance measures and/or expected time
                frames for deliverables met?
              </Text>
              <Text sx={sx.description}>
                {entity?.objectivesProgress_deliverablesMet[0].value}
              </Text>

              {entity?.objectivesProgress_deliverablesMet_otherText && (
                <>
                  <Text sx={sx.subtitle} data-testid="deliverables-other">
                    Describe progress toward reaching the target/milestone
                    during the reporting period. How close are you to meeting
                    the target? How do you plan to address any obstacle(s) to
                    meeting the target?
                  </Text>
                  <Text sx={sx.description}>
                    {entity?.objectivesProgress_deliverablesMet_otherText}
                  </Text>
                </>
              )}
            </Box>
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
  objectiveProgressBox: {
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
};
