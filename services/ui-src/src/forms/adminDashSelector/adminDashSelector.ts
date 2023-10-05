import { States } from "../../constants";
import { DropdownOptions } from "types";

// create dropdown options
const dropdownOptions: DropdownOptions[] = Object.keys(States).map((value) => {
  return {
    label: States[value as keyof typeof States],
    value,
  };
});

// create radio options
const reportChoices = [
  {
    id: "WP",
    label: "Work Plan (WP)",
  },
  {
    id: "SAR",
    label: "Semi-Annual Report (SAR)",
  },
];

export default {
  id: "adminDashSelector",
  editableByAdmins: true,
  options: {
    mode: "onChange",
  },
  fields: [
    {
      id: "state",
      type: "dropdown",
      validation: "dropdown",
      props: {
        hint: "Select state or territory:",
        options: dropdownOptions,
        ariaLabel:
          "List of states, including District of Columbia and Puerto Rico",
      },
    },
    {
      id: "report",
      type: "radio",
      validation: "radio",
      props: {
        hint: "Select a report:",
        choices: reportChoices,
        ariaLabel: "Choices of report type",
      },
    },
  ],
};
