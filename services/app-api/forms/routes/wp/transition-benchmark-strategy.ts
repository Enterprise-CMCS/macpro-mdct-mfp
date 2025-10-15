import { FormRoute } from "../../utils/types";

export const transitionBenchmarkStrategyRoute: FormRoute = {
  name: "Transition Benchmark Strategy",
  path: "/wp/transition-benchmark-strategy",
  pageType: "standard",
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
        id: "strategy_explaination",
        type: "textarea",
        validation: "text",
        props: {
          label:
            "Explain how you formulated your projected numbers, which should include descriptions of the data sources used, the time period for the analysis, and the methods used to project the number of transitions.",
        },
      },
      {
        id: "strategy_additionalDetails",
        type: "textarea",
        validation: "text",
        props: {
          label:
            "Provide additional detail on strategies or approaches the state or territory will use to achieve transition targets here and through a required state or territory-specific initiative.",
          className: "tbs-bottom-margin",
        },
      },
    ],
  },
};
