// components
import { Box, Heading } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { useStore } from "utils";
import { ChoiceFieldProps } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  heading,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  const { report } = useStore();

  const getDynamicChoices = () => {
    const isTargetPopulationChoices = choices.filter((choice) =>
      choice.id.match("targetPopulations")
    );
    if (isTargetPopulationChoices) {
      const targetPopulationChoices = report?.fieldData.targetPopulation;

      const labelCustomTargetPopulationChoice = (choice: any) => {
        if (targetPopulationChoices.indexOf(choice) >= 4) {
          return `Other: {${choice.transitionBenchmarks_targetPopulationName}}`;
        } else {
          return choice.transitionBenchmarks_targetPopulationName;
        }
      };

      const formatTargetPopulationChoices = targetPopulationChoices.map(
        (choice: any) => {
          return {
            checked: choice.checked,
            id: choice.id,
            label: labelCustomTargetPopulationChoice(choice),
            name: choice.transitionBenchmarks_targetPopulationName,
            value: choice.transitionBenchmarks_targetPopulationName,
          };
        }
      );

      return formatTargetPopulationChoices;
    } else {
      return choices;
    }
  };

  return (
    <Box sx={sxOverride}>
      {/* SAR field sections */}
      {heading && <Heading sx={sx.fieldHeading}>{heading}</Heading>}
      <ChoiceListField
        type="checkbox"
        name={name}
        label={label}
        choices={getDynamicChoices()}
        {...props}
      />
    </Box>
  );
};

const sx = {
  fieldHeading: {
    fontSize: "28px",
    paddingTop: "1.5rem",
  },
};
