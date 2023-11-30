import { removeNotApplicablePopsFromInitiatives } from "./data";

const targetPopulationNotApplicable = {
  id: "123",
  transitionBenchmarks_targetPopulationName: "Older adults",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "123-abc",
      value: "No",
    },
  ],
};

const targetPopulationApplicable = {
  id: "123",
  transitionBenchmarks_targetPopulationName: "Older adults",
  isRequired: true,
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "123-abc",
      value: "Yes",
    },
  ],
};

const targetPopulationUndefined = {
  id: "123",
  isRequired: true,
  transitionBenchmarks_targetPopulationName: "Older adults",
};

const userCreatedTargetPopulation = {
  id: "123",
  transitionBenchmarks_targetPopulationName: "User Created",
  transitionBenchmarks_applicableToMfpDemonstration: [
    {
      key: "123-abc",
      value: "No",
    },
  ],
};

const initiative = {
  id: "456",
  initiative_name: "a",
};

const initiativeOlderAdults = {
  key: "456-abc",
  value: "Older adults",
};

const initiativePD = {
  key: "456-def",
  value: "Individuals with physical disabilities (PD)",
};

const initiativeUserCreatedPopulation = {
  key: "789-ghi",
  value: "Other: User Created",
};

describe("Test removeNotApplicablePopsFromInitiatives", () => {
  it("should return the same field data if not given targetpopulations", async () => {
    const fieldData = {
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };
    const sameFieldData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(sameFieldData).toEqual(fieldData);
  });

  it("should return the same field data if not given initiatives", async () => {
    const fieldData = { targetPopulations: [targetPopulationNotApplicable] };
    const sameFieldData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(sameFieldData).toEqual(fieldData);
  });

  it("should remove a target population from an initiative if that population does not apply", async () => {
    const fieldData = {
      targetPopulations: [targetPopulationNotApplicable],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };

    const expectedOutput = {
      targetPopulations: [targetPopulationNotApplicable],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [initiativePD],
        },
      ],
    };
    const updatedData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(updatedData).toEqual(expectedOutput);
  });

  it("should NOT remove a target population from an initiative if that population applies", async () => {
    const fieldData = {
      targetPopulations: [targetPopulationApplicable],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };

    const expectedOutput = {
      targetPopulations: [targetPopulationApplicable],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };
    const updatedData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(updatedData).toEqual(expectedOutput);
  });

  it("should NOT remove a target population from an initiative if that population is undefined", async () => {
    const fieldData = {
      targetPopulations: [targetPopulationUndefined],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };

    const expectedOutput = {
      targetPopulations: [targetPopulationUndefined],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativePD,
          ],
        },
      ],
    };
    const updatedData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(updatedData).toEqual(expectedOutput);
  });

  it("should remove a user created target populations from an initiative if that population is not applicable", async () => {
    const fieldData = {
      targetPopulations: [userCreatedTargetPopulation],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [
            initiativeOlderAdults,
            initiativeUserCreatedPopulation,
          ],
        },
      ],
    };

    const expectedOutput = {
      targetPopulations: [userCreatedTargetPopulation],
      initiative: [
        {
          ...initiative,
          defineInitiative_targetPopulations: [initiativeOlderAdults],
        },
      ],
    };
    const updatedData = removeNotApplicablePopsFromInitiatives(fieldData);

    expect(updatedData).toEqual(expectedOutput);
  });
});
