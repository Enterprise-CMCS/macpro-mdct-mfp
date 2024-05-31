const { faker } = require("@faker-js/faker");

const newSemiAnnualReport = ({
  lastAlteredBy,
  reportPeriod,
  submissionName,
  state,
  fieldData,
}) => ({
  metadata: {
    finalSar: [
      {
        key: "finalSar-nrRmirBoVQv0ysWnEejNZD", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    isComplete: false,
    lastAlteredBy,
    locked: false,
    previousRevisions: [],
    populations: listPopulations(fieldData.targetPopulations),
    reportPeriod,
    reportType: "SAR",
    stateOrTerritory: state,
    status: "Not started",
    submissionName,
  },
  fieldData: {
    reportPeriod,
    stateName: fieldData.stateName,
    stateOrTerritory: state,
    submissionCount: 0,
    submissionName,
  },
});

const fillSemiAnnualReport = ({
  fieldData,
  populations,
  reportPeriod,
  reportYear,
}) => ({
  metadata: {
    lastAlteredBy: faker.person.fullName(),
    status: "In progress",
  },
  fieldData: {
    aa_changesMfpProgramAdministration: [
      {
        key: "aa_changesMfpProgramAdministration-2Vfw3X48qEyKOAxXt7HPlMMg", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    aa_notableAchievementsPromisingPractices: faker.lorem.sentence(),
    generalInformation_aorEmail: faker.internet.email(),
    generalInformation_aorName: faker.person.fullName(),
    generalInformation_aorTitleAgency: faker.company.name(),
    generalInformation_cmsProjectOfficerName: faker.person.fullName(),
    generalInformation_hasAorChangedSinceLastReport: [
      {
        key: "generalInformation_hasAorChangedSinceLastReport-2VffASWS2XRfAlc3uLzxCVAC", // pragma: allowlist secret
        value: "No",
      },
    ],
    generalInformation_MfpOperatingOrganizationName: faker.company.name(),
    generalInformation_mfpProgramPublicName: faker.company.name(),
    generalInformation_mfpProgramWebsite: faker.internet.url(),
    generalInformation_projectDirectorEmail: faker.internet.email(),
    generalInformation_projectDirectorName: faker.person.fullName(),
    generalInformation_projectDirectorTitle: faker.person.jobTitle(),
    generalInformation_stateTerritoryMedicaidAgency: faker.company.name(),
    generalInformation_stateTerritoryMedicaidDirector: faker.person.fullName(),
    initiative: updateInitiative(
      fieldData.initiative,
      reportPeriod,
      reportYear
    ),
    instructions_selfDirectedInitiatives:
      fieldData.instructions_selfDirectedInitiatives,
    instructions_tribalInitiatives: fieldData.instructions_tribalInitiatives,
    oa_additionalTechnicalResourcesSupports: [
      {
        key: "oa_additionalTechnicalResourcesSupports-2VfvDSkVxhYZwQ8AMXqR5QX8", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    oa_changesOrganizationAdministration: [
      {
        key: "oa_changesOrganizationAdministration-2VfuG4GRc4ApcknSSgbMvvHg", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    oa_describeAdditionalTechnicalResourcesSupports: faker.lorem.sentence(),
    oa_describeDevelopmentsChanges: faker.lorem.sentence(),
    oa_describeHiringRetentionChallenges: faker.lorem.sentence(),
    oa_describeOAChanges: faker.lorem.sentence(),
    oa_describeTechnicalAssitanceActivities: faker.lorem.sentence(),
    oa_hiringRetentionChallengesMfpStaff: [
      {
        key: "oa_hiringRetentionChallengesMfpStaff-2VfuyVGyPc6ePgAicM69ayDqTpX", // pragma: allowlist secret
        value: "Yes",
      },
    ],
    oa_projectDirectorEmployment: [
      {
        key: "oa_projectDirectorEmployment-2VfuG2OUicDROyaE5RmbtqWM", // pragma: allowlist secret
        value: "No",
      },
    ],
    oa_provideNameOfEmployerAndReportingRelationship: faker.person.fullName(),
    "otherReasons-otherText": "",
    ret_otherReasons: [
      {
        key: "ret_otherReasons-2VffASWS2XRfAlc3uLzxCVAC", // pragma: allowlist secret
        value: "Moved out of MFP jurisdiction/state/territory",
      },
    ],
    targetPopulations: fieldData.targetPopulations,
    ...addPopulationCounts(populations, reportPeriod),
  },
});

const addFundingSources = (fundingSources, quarters) => {
  const obj = {};

  fundingSources.forEach((fs) => {
    quarters.forEach((q) => {
      obj[`fundingSources_projected_${q}_${fs.id}`] =
        fs[`fundingSources_quarters${q}`];
      obj[`fundingSources_actual_${q}_${fs.id}`] = `${faker.number.float({
        min: 1,
        max: 100,
        fractionDigits: 2,
      })}`;
    });
  });

  return obj;
};

const addPopulationCounts = (populations, reportPeriod) => {
  const prefixes = [
    "ret-movedout-populations",
    "ret-mpdprp-1-populations",
    "ret-mpdprp-2-populations",
    "ret-mpdprp-3-populations",
    "ret-mtfqi-1-populations",
    "ret-mtfqi-2-populations",
    "ret-mtfqi-3-populations",
    "ret-mtfqi-4-populations",
    "ret-mtfqi-5-populations",
    "ret-mtfqr-1-populations",
    "ret-mtfqr-2-populations",
    "ret-mtfqr-3-populations",
    "ret-mtfqr-4-populations",
    "ret-nmpcprp-1-populations",
    "ret-npremrp-1-populations",
    "ret-tnamprp-1-populations",
    "ret_mtrp_quarter_1_populations",
    "ret_mtrp_quarter_2_populations",
    "ret_psmicf_target_populations",
  ];

  const obj = {};

  prefixes.forEach((prefix) => {
    populations.forEach(({ name }) => {
      obj[`${prefix}_Period${reportPeriod}_${name}`] = `${faker.number.int({
        min: 1,
        max: 100,
      })}`;
    });
  });

  return obj;
};

const listPopulations = (targetPopulations) => {
  return targetPopulations
    .filter(
      ({ transitionBenchmarks_applicableToMfpDemonstration }) =>
        transitionBenchmarks_applicableToMfpDemonstration[0].value === "Yes"
    )
    .map(({ id, transitionBenchmarks_targetPopulationName }) => ({
      id: `targetPopulations-${id}`,
      label: transitionBenchmarks_targetPopulationName,
      name: transitionBenchmarks_targetPopulationName,
      value: transitionBenchmarks_targetPopulationName,
    }));
};

const updateInitiative = (initiatives, reportPeriod, reportYear) => {
  const first = reportPeriod === 1 ? 1 : 3;
  const second = first + 1;
  const firstQuarter = `${reportYear}Q${first}`;
  const secondQuarter = `${reportYear}Q${second}`;

  return initiatives.map((initiative) => {
    return {
      ...initiative,
      expenditures_onTrackToFullExpendFunds: [
        {
          key: "expenditures_onTrackToFullExpendFunds-2WaUKOjwgUvHO6CMAqE8aOC", // pragma: allowlist secret
          value: "Yes",
        },
      ],
      "expenditures_onTrackToFullExpendFunds-otherText": "",
      initiativeProgress_describeCollaborationsWithExternalParties:
        faker.lorem.sentence(),
      initiativeProgress_describeIssuesChallenges: faker.lorem.sentence(),
      initiativeProgress_describeProgress: faker.lorem.sentence(),
      isCopied: true,
      objectiveProgress: updateObjectiveProgress(initiative.evaluationPlan, [
        firstQuarter,
        secondQuarter,
      ]),
      ...addFundingSources(initiative.fundingSources, [
        firstQuarter,
        secondQuarter,
      ]),
    };
  });
};

const updateObjectiveProgress = (evaluationPlan, quarters) => {
  return evaluationPlan.map((ep) => {
    const obj = {
      id: ep.id,
      objectiveProgress_additionalDetails: ep.evaluationPlan_additionalDetails,
      objectiveProgress_description: ep.evaluationPlan_description,
      objectiveProgress_objectiveName: ep.evaluationPlan_objectiveName,
      objectiveProgress_targets: ep.evaluationPlan_targets,
      objectivesProgress_deliverablesMet_otherText: "",
      objectivesProgress_deliverablesMet: [
        {
          key: "objectivesProgress_deliverablesMet-2WaO1Jj3pyUN0j9KjeOqR", // pragma: allowlist secret
          value: "Yes",
        },
      ],
      objectiveProgress_includesTargets: [
        {
          key: "evaluationPlan_includesTargets-UL4dAeyyvCFAXttxZioacR", // pragma: allowlist secret
          value: "No",
        },
      ],
      objectivesProgress_performanceMeasuresIndicators: faker.lorem.sentence(),
    };

    quarters.forEach((q) => {
      obj[`objectiveTargets_projections_${q}`] = ep[`quarterlyProjections${q}`];
      obj[`objectiveTargets_actual_${q}`] = `${faker.number.float({
        min: 1,
        max: 100,
        fractionDigits: 2,
      })}`;
    });
    return obj;
  });
};

module.exports = {
  newSemiAnnualReport,
  fillSemiAnnualReport,
};
