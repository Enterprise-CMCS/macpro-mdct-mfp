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
    label: "MFP Work Plan",
  },
  {
    id: "SAR",
    label: "MFP Semi-Annual Progress Report (SAR)",
  },
  {
    id: "Expenditure",
    label: "MFP Financial Reporting Form",
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
        label: "Select state or territory:",
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
        label: "Select a report:",
        choices: reportChoices,
        "aria-label": "Choices of report type",
      },
    },
  ],
};
