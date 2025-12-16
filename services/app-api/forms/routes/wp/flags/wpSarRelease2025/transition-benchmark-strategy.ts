import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const transitionBenchmarkStrategyRoute: FormRoute = {
  name: "Transition Benchmark Strategy",
  path: "/wp/transition-benchmark-strategy",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Transition Benchmark Strategy",
    },
  },
  form: {
    id: "tbs",
    fields: [
      {
        id: "strategy_explanation",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "Explain how you formulated your projected numbers, which should include descriptions of the data sources used, the time period for the analysis, and the methods used to project the number of transitions. For new/restarting programs or when adding a new target population(s), explain the baseline period used to establish projections. For existing programs, summarize the trend from previous reporting periods and how these inform your updated benchmarks.",
        },
      },
    ],
  },
};
