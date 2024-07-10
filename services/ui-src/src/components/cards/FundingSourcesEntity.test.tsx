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
  test("FundingSourcesEntity renders correctly", () => {
    render(fundingSourcesEntity);
    expect(
      screen.getByRole("heading", { name: "mock-funding-source" })
    ).toBeVisible();
    expect(screen.getByText("Projected quarterly expenditures")).toBeVisible();
    expect(screen.getByText("2024 Q1:")).toBeVisible();
  });

  testA11y(
    <FundingSourcesEntity
      formattedEntityData={mockFundingSourcesFormattedEntityData}
    />
  );
});
