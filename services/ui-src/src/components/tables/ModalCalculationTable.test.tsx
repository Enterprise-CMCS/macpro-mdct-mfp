import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalCalculationTable } from "./ModalCalculationTable";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const verbiage = {
  title: "Test Table Title",
  modal: "Open Modal",
};

const defaultProps = {
  id: "test-calculation-table",
  bodyRows: [],
  footRows: [],
  headRows: [],
  disabled: false,
  verbiage,
};

const ModalCalcTable = (
  <RouterWrappedComponent>
    <ModalCalculationTable {...defaultProps} />
  </RouterWrappedComponent>
)

describe("ModalCalculationTable", () => {
  it("renders the heading and button", () => {
    render(ModalCalcTable);
    expect(screen.getByRole("heading", { name: verbiage.title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: verbiage.modal })).toBeInTheDocument();
  });

  it("disables the button when disabled prop is true", () => {
    render(
      <RouterWrappedComponent>
        <ModalCalculationTable {...defaultProps} disabled={true} />
      </RouterWrappedComponent>
    );
    expect(screen.getByRole("button", { name: verbiage.modal })).toBeDisabled();
  });

  it("opens the modal when button is clicked", () => {
    render(ModalCalcTable);
    const button = screen.getByRole("button", { name: verbiage.modal });
    fireEvent.click(button);
    expect(screen.getByTestId("modal-submit-button")).toBeInTheDocument();
  });

  it("does not render the modal initially", () => {
    render(ModalCalcTable);
    expect(screen.queryByTestId("modal-submit-button")).not.toBeInTheDocument();
  });
});