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
    label: "MFP Work Plan (WP)",
  },
  {
    id: "SAR",
    label: "Semi-Annual Progress Report (SAR)",
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
        "aria-label":
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
        "aria-label": "Choices of report type",
      },
    },
  ],
};
