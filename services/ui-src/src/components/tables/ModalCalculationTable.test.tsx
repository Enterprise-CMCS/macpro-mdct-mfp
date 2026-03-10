import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { ModalCalculationTable } from "./ModalCalculationTable";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const verbiage = {
  title: "Test Table Title",
  modalButtonText: "Open Modal",
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
);

describe("ModalCalculationTable", () => {
  it("renders the heading and button", () => {
    render(ModalCalcTable);
    expect(
      screen.getByRole("heading", { name: verbiage.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: verbiage.modalButtonText })
    ).toBeInTheDocument();
  });

  it("disables the button when disabled prop is true", () => {
    render(
      <RouterWrappedComponent>
        <ModalCalculationTable {...defaultProps} disabled={true} />
      </RouterWrappedComponent>
    );
    expect(
      screen.getByRole("button", { name: verbiage.modalButtonText })
    ).toBeDisabled();
  });

  it("opens the modal when button is clicked", async () => {
    render(ModalCalcTable);
    const button = screen.getByRole("button", {
      name: verbiage.modalButtonText,
    });
    await userEvent.click(button);
    await waitFor(() =>
      expect(screen.getByTestId("modal-submit-button")).toBeVisible()
    );
  });

  it("does not render the modal initially", () => {
    render(ModalCalcTable);
    expect(screen.queryByTestId("modal-submit-button")).not.toBeInTheDocument();
  });
});
