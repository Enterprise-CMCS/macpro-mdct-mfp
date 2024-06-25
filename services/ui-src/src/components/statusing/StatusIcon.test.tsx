import { render } from "@testing-library/react";
import { StatusIcon } from "./StatusIcon";
// types
import { ReportType } from "types";

describe("StatusIcon functionality", () => {
  it("should render the correct status for complete SAR rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.SAR} status={true} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(successImages).toHaveLength(1);
    expect(successImages[0]).toBeVisible();
    expect(errorImages).toHaveLength(0);
  });
  it("should render the correct status for incomplete SAR rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.SAR} status={false} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(errorImages).toHaveLength(1);
    expect(errorImages[0]).toBeVisible();
    expect(successImages).toHaveLength(0);
  });
  it("should render the correct status for complete WP rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.WP} status={true} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(successImages).toHaveLength(1);
    expect(errorImages).toHaveLength(0);
  });
  it("should render the correct status for incomplete WP rows", () => {
    const { container } = render(
      <StatusIcon reportType={ReportType.WP} status={false} />
    );
    const errorImages = container.querySelectorAll(
      "img[alt='Error notification']"
    );
    const successImages = container.querySelectorAll(
      "img[alt='Success notification']"
    );
    expect(errorImages).toHaveLength(1);
    expect(errorImages[0]).toBeVisible();
    expect(successImages).toHaveLength(0);
  });
  it("should raise an error if you try to use an invalid report type", () => {
    expect(() => {
      render(
        <StatusIcon
          reportType={"invalidReportType" as ReportType}
          status={false}
        />
      );
    }).toThrowError(
      "Statusing icons for 'invalidReportType' have not been implemented."
    );
  });
});
