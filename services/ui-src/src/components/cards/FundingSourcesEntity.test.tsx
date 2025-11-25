import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import {
  mockFundingSourcesFormattedEntityData,
  mockFundingSourcesFormattedEntityDataNoQuarters,
} from "utils/testing/mockEntities";
import { FundingSourcesEntity } from "./FundingSourcesEntity";

const fundingSourcesEntity = (
  <FundingSourcesEntity
    formattedEntityData={mockFundingSourcesFormattedEntityData}
  />
);

const fundingSourcesEntityNoQuarters = (
  <FundingSourcesEntity
    formattedEntityData={mockFundingSourcesFormattedEntityDataNoQuarters}
  />
);

describe("<FundingSourcesEntity />", () => {
  test("FundingSourcesEntity renders with quarters", () => {
    render(fundingSourcesEntity);
    expect(
      screen.getByRole("heading", { name: "mock-funding-source" })
    ).toBeVisible();
    expect(screen.getByText("Projected quarterly expenditures")).toBeVisible();
    expect(screen.getByText("2024 Q1:")).toBeVisible();
  });

  test("Renders without quarters", () => {
    render(fundingSourcesEntityNoQuarters);
    expect(
      screen.getByRole("heading", { name: "mock-funding-source" })
    ).toBeVisible();
    expect(screen.queryByText("Projected quarterly expenditures")).toBeNull();
  });

  testA11yAct(
    <FundingSourcesEntity
      formattedEntityData={mockFundingSourcesFormattedEntityData}
    />
  );
});
