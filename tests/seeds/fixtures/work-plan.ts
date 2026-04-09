import crypto from "node:crypto";
import { faker } from "@faker-js/faker";
import {
  ReportFieldData,
  ReportStatus,
  ReportType,
} from "../../../services/app-api/utils/types";
import { dateFormat, quarterlyKeyValueGenerator } from "../helpers";
import { SeedFillReportShape, SeedNewReportShape } from "../types";

const BASE_TARGET_POPULATIONS: ReportFieldData[] = [
  {
    id: "2Vd02CVUtKgBETwqzDXpSIhi",
    isRequired: true,
    transitionBenchmarks_targetPopulationName: "Older adults",
  },
  {
    id: "2Vd02HAezQkxNu2ShmlQONHa",
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with physical disabilities (PD)",
    transitionBenchmarks_targetPopulationName_short: "PD",
  },
  {
    id: "2Vd02IvLwE59ebYAjfiU7H66",
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with intellectual and developmental disabilities (I/DD)",
    transitionBenchmarks_targetPopulationName_short: "I/DD",
  },
  {
    id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with mental health and substance use disorders (MH/SUD)",
    transitionBenchmarks_targetPopulationName_short: "MH/SUD",
  },
];

export const newWorkPlan = (
  flags: { [key: string]: true },
  stateName: string,
  reportYear: number,
  reportPeriod: number
): SeedNewReportShape => {
  if (Object.keys(flags).length > 0) {
    // Add data mods by flag
  }

  return {
    metadata: {
      isComplete: false,
      lastAlteredBy: faker.person.fullName(),
      locked: false,
      previousRevisions: [],
      reportPeriod: reportPeriod,
      reportType: ReportType.WP,
      reportYear: reportYear,
      status: ReportStatus.NOT_STARTED,
      submissionCount: 0,
      submissionName: "Work Plan",
    },
    fieldData: {
      stateName,
      submissionName: "Work Plan",
      targetPopulations: BASE_TARGET_POPULATIONS,
    },
  };
};

export const fillWorkPlan = (
  flags: { [key: string]: true },
  year: number,
  period: number
): SeedFillReportShape => {
  const data = {
    metadata: {
      lastAlteredBy: faker.person.fullName(),
      status: ReportStatus.IN_PROGRESS,
    },
    fieldData: {
      instructions_selfDirectedInitiatives: [
        {
          key: "instructions_selfDirectedInitiatives-3DGAqqnOBE2kwKVFMxUt3A",
          value: "No",
        },
      ],
      instructions_tribalInitiatives: [
        {
          key: "instructions_tribalInitiatives-3DGAqqnOBE2kwKVFMxUt3A",
          value: "No",
        },
      ],
      initiative: addInitiative(flags, year, period),
      targetPopulations: updateTargetPopulations(year, period),
    },
  };

  let flaggedData = {};

  if (flags.wpSarRelease2025) {
    flaggedData = {
      strategy_explanation: faker.lorem.sentence(),
    };
  } else {
    flaggedData = {
      strategy_additionalDetails: faker.lorem.sentence(),
      strategy_explaination: faker.lorem.sentence(),
    };
  }

  return {
    ...data,
    fieldData: {
      ...data.fieldData,
      ...flaggedData,
    },
  };
};

const addEvaluationPlan = (
  year: number,
  period: number,
  numberOfPlans: number = 1
): ReportFieldData[] => {
  return [...Array.from({ length: numberOfPlans }).keys()].map((i) => {
    const numType = i === 0 ? null : "int";
    // Plans alternate between No for first plan, Yes for second plan, etc.
    const transition =
      i === 0
        ? {
            key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR",
            value: "No",
          }
        : {
            key: "evaluationPlan_includesTargets-7FP4jcg4jK7Ssqp3cCW5vQ",
            value: "Yes",
          };

    return {
      id: crypto.randomUUID(),
      evaluationPlan_additionalDetails: faker.lorem.sentence(),
      evaluationPlan_description: faker.lorem.sentence(),
      evaluationPlan_includesTargets: [transition],
      evaluationPlan_objectiveName: faker.music.songName(),
      evaluationPlan_targets: faker.lorem.sentence(),
      ...quarterlyKeyValueGenerator(
        year,
        period,
        "quarterlyProjections",
        numType
      ),
    };
  });
};

const addInitiative = (
  flags: { [key: string]: true },
  year: number,
  period: number
): ReportFieldData[] => {
  const initiativeTargetPopulations = [
    {
      key: "targetPopulations-2Vd02CVUtKgBETwqzDXpSIhi",
      value: "Older adults",
    },
    {
      key: "targetPopulations-2Vd02IvLwE59ebYAjfiU7H66",
      value:
        "Individuals with intellectual and developmental disabilities (I/DD)",
    },
    {
      key: "targetPopulations-3Nc13O5GHA6Hc4KheO5FMSD2",
      value: "HCBS infrastructure/system-level development",
    },
  ];

  const initativeWorkPlanTopics = [
    {
      key: "initiative_wpTopic-VjQ0OFqior9Dxu5RRNiZ5u",
      value: "Transitions and transition coordination services*",
    },
    {
      key: "initiative_wpTopic-wbUsMMqVP7q1n10szK5h5S",
      value: "Housing-related supports*",
    },
    {
      key: "initiative_wpTopic-SdaFlF3DJyzKcHCCu3Zylm",
      value: "Quality measurement and improvement*",
    },
  ];

  let flaggedData = {};

  if (flags.wpSarRelease2025) {
    flaggedData = {
      defineInitiative_actualStartDate_value: "",
      defineInitiative_endDate: dateFormat.format(faker.date.future()),
      defineInitiative_expectedStartDate_value: dateFormat.format(
        faker.date.past()
      ),
      defineInitiative_fundingSources: [
        {
          key: "defineInitiative_fundingSources-awTB7dbwBc8x3fRjbWIRlC",
          value: "MFP administrative cooperative agreement funding",
        },
      ],
      defineInitiative_keyActivities: [
        {
          id: crypto.randomUUID(),
          name: faker.lorem.sentence(),
        },
      ],
      defineInitiative_keyMetrics_performanceIndicators: [],
      defineInitiative_qualitativeMethods: faker.lorem.sentence(),
      defineInitiative_purposeAndGoals: faker.lorem.sentence(),
      defineInitiative_startDate: [
        {
          key: "defineInitiative_startDate-wHDw5laJkJIRG1FrHs5VS6",
          value: "Expected start date",
        },
      ],
    };
  } else {
    flaggedData = {
      defineInitiative_projectedEndDate_value: "",
      defineInitiative_projectedEndDate: [
        {
          key: "defineInitiative_projectedEndDate-TR6HoXF3Unf2QX0zzDg2Kp",
          value: "No",
        },
      ],
      defineInitiative_projectedStartDate: dateFormat.format(faker.date.past()),
      evaluationPlan: addEvaluationPlan(year, period, 2),
      fundingSources: [
        {
          id: crypto.randomUUID(),
          fundingSources_wpTopic: [
            {
              key: "fundingSources_wpTopic-2VLpZ9A92OivbZhKvY8pE4hB65c",
              value:
                "MFP cooperative agreement funds for administrative activities",
            },
          ],
          initiative_wp_otherTopic: "",
          ...quarterlyKeyValueGenerator(
            year,
            period,
            "fundingSources_quarters",
            "float"
          ),
        },
      ],
    };
  }

  const createInitiative = (index: number) => ({
    id: crypto.randomUUID(),
    defineInitiative_describeInitiative: faker.lorem.sentence(),
    defineInitiative_targetPopulations: initiativeTargetPopulations,
    initiative_name: faker.music.songName(),
    initiative_wp_otherTopic: "",
    isOtherEntity: true,
    initiative_wpTopic: [initativeWorkPlanTopics[index]],
    type: "initiative",
    ...flaggedData,
  });

  return Array.from({ length: 3 }).map((_, index: number) =>
    createInitiative(index)
  );
};

const updateTargetPopulations = (
  year: number,
  period: number
): ReportFieldData[] => {
  return BASE_TARGET_POPULATIONS.map((targetPopulation) => {
    const inactive = ["PD", "MH/SUD"].includes(
      targetPopulation.transitionBenchmarks_targetPopulationName_short as string
    );

    const numType = inactive ? null : "int";
    const transition = inactive
      ? {
          key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v",
          value: "No",
        }
      : {
          key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd",
          value: "Yes",
        };

    return {
      ...targetPopulation,
      transitionBenchmarks_applicableToMfpDemonstration: [transition],
      ...quarterlyKeyValueGenerator(
        year,
        period,
        "quarterlyProjections",
        numType
      ),
    };
  });
};
