import crypto from "crypto";
import { faker } from "@faker-js/faker";
import {
  ReportFieldData,
  ReportStatus,
  ReportType,
} from "../../../services/app-api/utils/types";
import { dateFormat, quarterlyKeyValueGenerator } from "../helpers";
import { SeedFillReportShape, SeedNewReportShape } from "../types";

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
      targetPopulations: [],
    },
  };
};

export const fillWorkPlan = (
  flags: { [key: string]: true },
  year: number,
  period: number
): SeedFillReportShape => {
  let data = {
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
      strategy_additionalDetails: faker.lorem.sentence(),
      strategy_explaination: faker.lorem.sentence(),
      targetPopulations: updateTargetPopulations(year, period),
    },
  };

  if (flags.wpSarRelease2025) {
    // Removed fields
    const {
      strategy_additionalDetails, // eslint-disable-line @typescript-eslint/no-unused-vars
      strategy_explaination, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = data.fieldData;

    data = {
      ...data,
      fieldData: {
        ...rest,
        strategy_explanation: faker.lorem.sentence(),
      } as any,
    };
  }

  return data;
};

const addEvaluationPlan = (
  year: number,
  period: number,
  numberOfPlans: number = 1
): ReportFieldData[] => {
  return [...Array(numberOfPlans).keys()].map((i) => {
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

  let flaggedData = {};

  if (flags.wpSarRelease2025) {
    flaggedData = {
      defineInitiative_keyActivities: [
        {
          id: crypto.randomUUID(),
          name: faker.word.noun(),
        },
      ],
      defineInitiative_startDateExpectedOrActual: [
        {
          key: "defineInitiative_startDateExpectedOrActual_gEZeX7wqIBgNECJWohPPGJ",
          value: "Actual",
        },
      ],
    };
  }

  const createInitiative = () => ({
    id: crypto.randomUUID(),
    defineInitiative_describeInitiative: faker.lorem.sentence(),
    defineInitiative_projectedEndDate_value: "",
    defineInitiative_projectedEndDate: [
      {
        key: "defineInitiative_projectedEndDate-TR6HoXF3Unf2QX0zzDg2Kp",
        value: "No",
      },
    ],
    defineInitiative_targetPopulations: initiativeTargetPopulations,
    defineInitiative_projectedStartDate: dateFormat.format(faker.date.past()),
    evaluationPlan: addEvaluationPlan(year, period),
    initiative_name: faker.music.songName(),
    initiative_wp_otherTopic: "",
    isOtherEntity: true,
    type: "initiative",
    ...flaggedData,
  });

  return [
    {
      ...createInitiative(),
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
      initiative_wpTopic: [
        {
          key: "initiative_wpTopic-VjQ0OFqior9Dxu5RRNiZ5u",
          value: "Transitions and transition coordination services",
        },
      ],
    },
    {
      ...createInitiative(),
      defineInitiative_projectedEndDate: [
        {
          key: "defineInitiative_projectedEndDate-WNsSaAHeDvRD2Pjkz6DcOE",
          value: "Yes",
        },
      ],
      defineInitiative_projectedEndDate_value: dateFormat.format(
        faker.date.future()
      ),
      evaluationPlan: addEvaluationPlan(year, period, 2),
      fundingSources: [
        {
          id: crypto.randomUUID(),
          fundingSources_wpTopic: [
            {
              key: "fundingSources_wpTopic-2VLpZ9A92OivbZhKvY8pE4hB65c",
              value:
                "MFP cooperative agreement funds for qualified HCBS and demonstration services",
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
        {
          id: crypto.randomUUID(),
          fundingSources_wpTopic: [
            {
              key: "fundingSources_wpTopic-2VLpZCRWieGr1Z49QX5Aqc",
              value:
                "State or territory equivalent funds attributable to the MFP-enhanced match",
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
      initiative_wpTopic: [
        {
          key: "initiative_wpTopic-wbUsMMqVP7q1n10szK5h5S",
          value: "Housing-related supports",
        },
      ],
    },
    {
      ...createInitiative(),
      fundingSources: [
        {
          id: crypto.randomUUID(),
          fundingSources_wpTopic: [
            {
              key: "fundingSources_wpTopic-2VLpZDJ9qaKKOk78ztBdiB",
              value:
                "MFP cooperative agreement funds for capacity-building initiatives",
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
      initiative_wpTopic: [
        {
          key: "initiative_wpTopic-SdaFlF3DJyzKcHCCu3Zylm",
          value: "Quality measurement and improvement",
        },
      ],
    },
  ];
};

const updateTargetPopulations = (
  year: number,
  period: number
): ReportFieldData[] => {
  const targetPopulations = [
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

  return targetPopulations.map((targetPopulation) => {
    const inactive = ["PD", "MH/SUD"].includes(
      targetPopulation.transitionBenchmarks_targetPopulationName_short || ""
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
