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
    initiative: initiatives(year, period),
    strategy_additionalDetails: faker.lorem.sentence(),
    strategy_explaination: faker.lorem.sentence(),
    targetPopulations: updateTargetPopulations(year, period),
  },
});

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

const initiatives = (year, period) => [
  {
    id: "0233117-8310-812-e28a-6e1d33e3d1e1",
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
    evaluationPlan: [
      {
        id: "fc50c3-d41a-131a-ac5a-b73ab8361e",
        evaluationPlan_additionalDetails: faker.lorem.sentence(),
        evaluationPlan_description: faker.lorem.sentence(),
        evaluationPlan_includesTargets: [
          {
            key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR", // pragma: allowlist secret
            value: "No",
          },
        ],
        evaluationPlan_objectiveName: faker.music.songName(),
        evaluationPlan_targets: faker.lorem.sentence(),
        ...quarterlyKeyGenerator(year, period, "quarterlyProjections", null),
      },
    ],
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
    id: "717e8d5-88c-1dbf-cb06-15a755e5e468",
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
    evaluationPlan: [
      {
        id: "d1f1dd1-0501-c46f-4a8c-6d28c5c4ddb",
        evaluationPlan_additionalDetails: faker.lorem.sentence(),
        evaluationPlan_description: faker.lorem.sentence(),
        evaluationPlan_includesTargets: [
          {
            key: "evaluationPlan_includesTargets-7FP4jcg4jK7Ssqp3cCW5vQ", // pragma: allowlist secret
            value: "Yes",
          },
        ],
        evaluationPlan_objectiveName: faker.music.songName(),
        evaluationPlan_targets: faker.lorem.sentence(),
        ...quarterlyKeyGenerator(year, period, "quarterlyProjections", "int"),
      },
      {
        id: "0bafc3b-366c-181d-f1ee-a6026e606e5e",
        evaluationPlan_additionalDetails: faker.lorem.sentence(),
        evaluationPlan_description: faker.lorem.sentence(),
        evaluationPlan_includesTargets: [
          {
            key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR", // pragma: allowlist secret
            value: "No",
          },
        ],
        evaluationPlan_objectiveName: faker.music.songName(),
        evaluationPlan_targets: faker.lorem.sentence(),
        ...quarterlyKeyGenerator(year, period, "quarterlyProjections", null),
      },
    ],
    fundingSources: [
      {
        id: "0d56d1-7bc-00c5-7841-a162068427e",
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
        id: "d7de16a-cc3d-26cc-8888-f8efa6dfb6fa", // pragma: allowlist secret
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
    id: "a3c64a8-52ea-b5c1-afce-46302c4aa7c",
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
    evaluationPlan: [
      {
        id: "6245730-f1a7-846f-32b4-fbfe7040c6e0",
        evaluationPlan_additionalDetails: faker.lorem.sentence(),
        evaluationPlan_description: faker.lorem.sentence(),
        evaluationPlan_includesTargets: [
          {
            key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR", // pragma: allowlist secret
            value: "No",
          },
        ],
        evaluationPlan_objectiveName: faker.music.songName(),
        evaluationPlan_targets: faker.lorem.sentence(),
        ...quarterlyKeyGenerator(year, period, "quarterlyProjections", null),
      },
    ],
    fundingSources: [
      {
        id: "c73235e-8fec-37-2062-b502384bac6",
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

module.exports = {
  newWorkPlan,
  fillWorkPlan,
};
