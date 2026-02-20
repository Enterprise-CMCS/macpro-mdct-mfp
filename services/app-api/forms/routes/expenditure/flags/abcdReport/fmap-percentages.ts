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
          type: "p",
          children: [
            {
              type: "html",
              content:
                "Enter the Enhanced Federal Medical Assistance Percentage (E-FMAP) for your state for each category below. Please refer to the FMAP rates published in the ",
            },
            {
              type: "externalLink",
              content: "Federal Register",
              props: {
                href: "https://www.federalregister.gov/",
                target: "_blank",
                "aria-label": "Federal Register (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                " for the appropriate year. Fiscal year 2025 FMAP rates are available at  ",
            },
            {
              type: "externalLink",
              content: "https://www.federalregister.gov/d/2023-25636",
              props: {
                href: "https://www.federalregister.gov/d/2023-25636",
                target: "_blank",
                "aria-label":
                  "Federal Register Fiscal year 2025 FMAP rates (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content: ". Fiscal year 2026 FMAP rates are available at ",
            },
            {
              type: "externalLink",
              content: "https://www.federalregister.gov/d/2024-27910",
              props: {
                href: "https://www.federalregister.gov/d/2024-27910",
                target: "_blank",
                "aria-label":
                  "Federal Register Fiscal year 2026 FMAP rates (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                ". Additional information about the MFP-Enhanced FMAP can be found in the MFP Program Terms and Conditions (PTC), specifically PTC 22.",
            },
            {
              type: "p",
              content:
                "In the sections that follow, your state or territory’s share for each service will be calculated using the Enhanced FMAP that you provide here.",
            },
          ],
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
