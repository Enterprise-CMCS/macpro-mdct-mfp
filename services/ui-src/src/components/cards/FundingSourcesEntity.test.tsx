import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { mockFundingSourcesFormattedEntityData } from "utils/testing/mockEntities";
import { FundingSourcesEntity } from "./FundingSourcesEntity";

const fundingSourcesEntity = (
  <FundingSourcesEntity
    formattedEntityData={mockFundingSourcesFormattedEntityData}
  />
);

describe("<FundingSourcesEntity />", () => {
  beforeEach(() => {
    render(fundingSourcesEntity);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("FundingSourcesEntity renders correctly", () => {
    expect(screen.getByText("Projected quarterly expenditures")).toBeVisible();
  });

  testA11y(
    <FundingSourcesEntity
      formattedEntityData={mockFundingSourcesFormattedEntityData}
    />
  );
});
