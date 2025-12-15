import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationComparator,
  ValidationType,
} from "../../../../../utils/types";

export const fmapPercentagesRoute: FormRoute = {
  name: "FMAP Percentages",
  path: "/expenditure/fmap-percentages",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "FMAP Percentages",
      info: [
        {
          type: "html",
          content:
            "Enter the Enhanced Federal Medical Assistance Percentage (E-FMAP) for your state for each category below. The rate for your state through 2025 can be found on ",
        },
        {
          type: "externalLink",
          content: "KFF.org",
          props: {
            href: "https://www.kff.org/medicaid/state-indicator/federal-matching-rate-and-multiplier/?currentTimeframe=0&sortModel=%7B%22colId%22:%22Location%22,%22sort%22:%22asc%22%7D",
            target: "_blank",
            "aria-label": "KFF.org (Link opens in new tab)",
          },
        },
      ],
    },
  },
  form: {
    id: "exp-fmapPercentages",
    fields: [
      {
        id: "fmap_qualifiedHcbsPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: {
          type: ValidationType.NUMBER_COMPARISON,
          options: {
            boundary: 90,
            comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
          },
        },
        props: {
          label: "Enhanced FMAP: Qualified HCBS",
          hint: "Enter percentage.",
          mask: "percentage",
        },
      },
      {
        id: "fmap_demonstrationServicesPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: {
          type: ValidationType.NUMBER_COMPARISON,
          options: {
            boundary: 90,
            comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
          },
        },
        props: {
          label: "Enhanced FMAP: Demonstration Services",
          hint: "Enter percentage.",
          mask: "percentage",
        },
      },
    ],
  },
};
