import { notAnsweredText } from "../../constants";
import {
  fillEmptyQuarters,
  removeNotApplicablePopulations,
  resetClearProp,
} from "./forms";
// types
import { FormField } from "types";
import {
  mockDateField,
  mockFormField,
  mockNestedFormField,
  mockNumberField,
  mockTargetPopButOtherApplicable,
  mockTargetPopButOtherNotApplicable,
  mockTargetPopByOtherNotDefined,
  mockTargetPopReqButApplicable,
  mockTargetPopReqButApplicableIsUndefined,
  mockTargetPopReqButNotApplicable,
} from "utils/testing/setupJest";
import { AnyObject } from "yup/lib/types";

describe("Test resetClearProp", () => {
  it("should reset clear for choicelist fields and its nested children", async () => {
    const fields: FormField[] = [mockNestedFormField];
    resetClearProp(fields);
    expect(fields[0].props!.clear).toBe(false);
    for (let choice of fields[0].props!.choices) {
      expect(choice.props!.clear).toBe(false);
    }
  });

  it("should reset clear for text fields", async () => {
    const fields: FormField[] = [mockFormField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for number fields", async () => {
    const fields: FormField[] = [mockNumberField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for date fields", async () => {
    const fields: FormField[] = [mockDateField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });
});

describe("Test removeNotApplicablePopulations", () => {
  const exampleTargetPopulations = [
    mockTargetPopReqButNotApplicable,
    mockTargetPopReqButApplicable,
    mockTargetPopReqButApplicableIsUndefined,
    mockTargetPopButOtherApplicable,
    mockTargetPopButOtherNotApplicable,
    mockTargetPopByOtherNotDefined,
  ];

  it("should filter out any target population that has a no value for transitionBenchmarks_applicableToMfpDemonstration", async () => {
    const filteredPopulations = removeNotApplicablePopulations(
      exampleTargetPopulations
    );
    expect(filteredPopulations.length).toBe(4);
    expect(filteredPopulations).toEqual([
      mockTargetPopReqButApplicable,
      mockTargetPopReqButApplicableIsUndefined,
      mockTargetPopButOtherApplicable,
      mockTargetPopByOtherNotDefined,
    ]);
  });
});

describe("Test fillEmptyQuarters", () => {
  it("should has 12 quarters and 2 values as not answered", () => {
    let mockQuarters = [];
    for (var i = 0; i < 10; i++) mockQuarters.push({ id: `2021 Q1`, value: i });

    const newQuarters: AnyObject[] = fillEmptyQuarters(mockQuarters);
    expect(newQuarters).toHaveLength(12);
    expect(
      newQuarters.filter((quarter) => quarter.value === notAnsweredText)
    ).toHaveLength(2);
  });
});
