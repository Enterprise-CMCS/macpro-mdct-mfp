import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { DynamicTableProvider } from "./DynamicTableProvider";
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
    <DynamicTableProvider>
      <ModalCalculationTable {...defaultProps} />
    </DynamicTableProvider>
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

  it("renders table head, body, and foot rows", () => {
    const headRows = [["Head1", "Head2"]];
    const bodyRows = [["Body1", "Body2"]];
    const footRows = [["Foot1", "Foot2"]];
    render(
      <RouterWrappedComponent>
        <DynamicTableProvider>
          <ModalCalculationTable
            {...defaultProps}
            headRows={headRows}
            bodyRows={bodyRows}
            footRows={footRows}
          />
        </DynamicTableProvider>
      </RouterWrappedComponent>
    );
    // Head
    expect(screen.getByText("Head1")).toBeInTheDocument();
    expect(screen.getByText("Head2")).toBeInTheDocument();
    // Body
    expect(screen.getByText("Body1")).toBeInTheDocument();
    expect(screen.getByText("Body2")).toBeInTheDocument();
    // Foot
    expect(screen.getByText("Foot1")).toBeInTheDocument();
    expect(screen.getByText("Foot2")).toBeInTheDocument();
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
