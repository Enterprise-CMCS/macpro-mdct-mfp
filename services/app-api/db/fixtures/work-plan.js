const crypto = require("crypto");
const { faker } = require("@faker-js/faker");
const {
  dateFormat,
  quarterlyKeyGenerator,
  randomReportPeriod,
  randomReportYear,
} = require("../helpers.js");

const newWorkPlan = (stateName) => ({
  metadata: {
    isComplete: false,
    lastAlteredBy: faker.person.fullName(),
    locked: false,
    previousRevisions: [],
    reportPeriod: randomReportPeriod,
    reportType: "WP",
    reportYear: randomReportYear,
    status: "Not started",
    submissionName: "Work Plan",
  },
  fieldData: {
    stateName,
    submissionCount: 0,
    submissionName: "Work Plan",
    targetPopulations,
  },
});

const fillWorkPlan = (year, period) => ({
  metadata: {
    lastAlteredBy: faker.person.fullName(),
    status: "In progress",
  },
  fieldData: {
    instructions_selfDirectedInitiatives: [
      {
        key: "instructions_selfDirectedInitiatives-3DGAqqnOBE2kwKVFMxUt3A", // pragma: allowlist secret
        value: "No",
      },
    ],
    instructions_tribalInitiatives: [
      {
        key: "instructions_tribalInitiatives-3DGAqqnOBE2kwKVFMxUt3A", // pragma: allowlist secret
        value: "No",
      },
    ],
    initiative: addInitiative(year, period),
    strategy_additionalDetails: faker.lorem.sentence(),
    strategy_explaination: faker.lorem.sentence(),
    targetPopulations: updateTargetPopulations(year, period),
  },
});

const addEvaluationPlan = (year, period, numberOfPlans = 1) => {
  return [...Array(numberOfPlans).keys()].map((i) => {
    const numType = i === 0 ? null : "int";
    const transition =
      i === 0
        ? {
            key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR", // pragma: allowlist secret
            value: "No",
          }
        : {
            key: "evaluationPlan_includesTargets-7FP4jcg4jK7Ssqp3cCW5vQ", // pragma: allowlist secret
            value: "Yes",
          };

    return {
      id: crypto.randomUUID(),
      evaluationPlan_additionalDetails: faker.lorem.sentence(),
      evaluationPlan_description: faker.lorem.sentence(),
      evaluationPlan_includesTargets: [transition],
      evaluationPlan_objectiveName: faker.music.songName(),
      evaluationPlan_targets: faker.lorem.sentence(),
      ...quarterlyKeyGenerator(year, period, "quarterlyProjections", numType),
    };
  });
};

const addInitiative = (year, period) => [
  {
    id: crypto.randomUUID(),
    defineInitiative_describeInitiative: faker.lorem.sentence(),
    defineInitiative_projectedStartDate: dateFormat.format(faker.date.past()),
    defineInitiative_projectedEndDate_value: "",
    defineInitiative_projectedEndDate: [
      {
        key: "defineInitiative_projectedEndDate-TR6HoXF3Unf2QX0zzDg2Kp", // pragma: allowlist secret
        value: "No",
      },
    ],
    defineInitiative_targetPopulations: initiativeTargetPopulations,
    evaluationPlan: addEvaluationPlan(year, period),
    fundingSources: [
      {
        id: "17f1df3-4a0-a48f-8354-db0223b43b8c",
        fundingSources_wpTopic: [
          {
            key: "fundingSources_wpTopic-2VLpZ9A92OivbZhKvY8pE4hB65c", // pragma: allowlist secret
            value:
              "MFP cooperative agreement funds for administrative activities",
          },
        ],
        initiative_wp_otherTopic: "",
        ...quarterlyKeyGenerator(
          year,
          period,
          "fundingSources_quarters",
          "float"
        ),
      },
    ],
    initiative_name: faker.music.songName(),
    initiative_wp_otherTopic: "",
    initiative_wpTopic: [
      {
        key: "initiative_wpTopic-VjQ0OFqior9Dxu5RRNiZ5u", // pragma: allowlist secret
        value: "Transitions and transition coordination services",
      },
    ],
    isOtherEntity: true,
    type: "initiative",
  },
  {
    id: crypto.randomUUID(),
    defineInitiative_describeInitiative: faker.lorem.sentence(),
    defineInitiative_projectedStartDate: dateFormat.format(faker.date.past()),
    defineInitiative_projectedEndDate: [
      {
        key: "defineInitiative_projectedEndDate-WNsSaAHeDvRD2Pjkz6DcOE", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    defineInitiative_projectedEndDate_value: dateFormat.format(
      faker.date.future()
    ),
    defineInitiative_targetPopulations: initiativeTargetPopulations,
    evaluationPlan: addEvaluationPlan(year, period, 2),
    fundingSources: [
      {
        id: crypto.randomUUID(),
        fundingSources_wpTopic: [
          {
            key: "fundingSources_wpTopic-2VLpZ9A92OivbZhKvY8pE4hB65c", // pragma: allowlist secret
            value:
              "MFP cooperative agreement funds for qualified HCBS and demonstration services",
          },
        ],
        initiative_wp_otherTopic: "",
        ...quarterlyKeyGenerator(
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
            key: "fundingSources_wpTopic-2VLpZCRWieGr1Z49QX5Aqc", // pragma: allowlist secret
            value:
              "State or territory equivalent funds attributable to the MFP-enhanced match",
          },
        ],
        initiative_wp_otherTopic: "",
        ...quarterlyKeyGenerator(
          year,
          period,
          "fundingSources_quarters",
          "float"
        ),
      },
    ],
    initiative_name: faker.music.songName(),
    initiative_wp_otherTopic: "",
    initiative_wpTopic: [
      {
        key: "initiative_wpTopic-wbUsMMqVP7q1n10szK5h5S", // pragma: allowlist secret
        value: "Housing-related supports",
      },
    ],
    isOtherEntity: true,
    type: "initiative",
  },
  {
    id: crypto.randomUUID(),
    defineInitiative_describeInitiative: faker.lorem.sentence(),
    defineInitiative_projectedEndDate_value: "",
    defineInitiative_projectedStartDate: dateFormat.format(faker.date.future()),
    defineInitiative_targetPopulations: initiativeTargetPopulations,
    defineInitiative_projectedEndDate: [
      {
        key: "defineInitiative_projectedEndDate-TR6HoXF3Unf2QX0zzDg2Kp", // pragma: allowlist secret
        value: "No",
      },
    ],
    evaluationPlan: addEvaluationPlan(year, period),
    fundingSources: [
      {
        id: crypto.randomUUID(),
        fundingSources_wpTopic: [
          {
            key: "fundingSources_wpTopic-2VLpZDJ9qaKKOk78ztBdiB", // pragma: allowlist secret
            value:
              "MFP cooperative agreement funds for capacity-building initiatives",
          },
        ],
        initiative_wp_otherTopic: "",
        ...quarterlyKeyGenerator(
          year,
          period,
          "fundingSources_quarters",
          "float"
        ),
      },
    ],
    initiative_name: faker.music.songName(),
    initiative_wp_otherTopic: "",
    initiative_wpTopic: [
      {
        key: "initiative_wpTopic-SdaFlF3DJyzKcHCCu3Zylm", // pragma: allowlist secret
        value: "Quality measurement and improvement",
      },
    ],
    isOtherEntity: true,
    type: "initiative",
  },
];

const initiativeTargetPopulations = [
  {
    key: "targetPopulations-2Vd02CVUtKgBETwqzDXpSIhi", // pragma: allowlist secret
    value: "Older adults",
  },
  {
    key: "targetPopulations-2Vd02IvLwE59ebYAjfiU7H66", // pragma: allowlist secret
    value:
      "Individuals with intellectual and developmental disabilities (I/DD)",
  },
  {
    key: "targetPopulations-3Nc13O5GHA6Hc4KheO5FMSD2", // pragma: allowlist secret
    value: "HCBS infrastructure/system-level development",
  },
];

const targetPopulations = [
  {
    id: "2Vd02CVUtKgBETwqzDXpSIhi", // pragma: allowlist secret
    isRequired: true,
    transitionBenchmarks_targetPopulationName: "Older adults",
  },
  {
    id: "2Vd02HAezQkxNu2ShmlQONHa", // pragma: allowlist secret
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with physical disabilities (PD)",
    transitionBenchmarks_targetPopulationName_short: "PD",
  },
  {
    id: "2Vd02IvLwE59ebYAjfiU7H66", // pragma: allowlist secret
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with intellectual and developmental disabilities (I/DD)",
    transitionBenchmarks_targetPopulationName_short: "I/DD",
  },
  {
    id: "2Vd02J1FHl3Ka1DbtU5FMSDh", // pragma: allowlist secret
    isRequired: true,
    transitionBenchmarks_targetPopulationName:
      "Individuals with mental health and substance use disorders (MH/SUD)",
    transitionBenchmarks_targetPopulationName_short: "MH/SUD",
  },
];

const updateTargetPopulations = (year, period) => {
  return targetPopulations.map((targetPopulation) => {
    const notActive = ["PD", "MH/SUD"].includes(
      targetPopulation.transitionBenchmarks_targetPopulationName_short
    );

    const numType = notActive ? null : "int";
    const transition = notActive
      ? {
          key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIwERkSKEGVUU1g8E1v", // pragma: allowlist secret
          value: "No",
        }
      : {
          key: "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd", // pragma: allowlist secret
          value: "Yes",
        };

    return {
      ...targetPopulation,
      transitionBenchmarks_applicableToMfpDemonstration: [transition],
      ...quarterlyKeyGenerator(year, period, "quarterlyProjections", numType),
    };
  });
};

module.exports = {
  newWorkPlan,
  fillWorkPlan,
};
