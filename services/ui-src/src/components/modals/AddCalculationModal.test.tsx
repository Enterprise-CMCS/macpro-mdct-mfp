import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { AddCalculationModal } from "./AddCalculationModal";
//utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockCloseHandler = jest.fn();

const modalComponent = (
  <RouterWrappedComponent>
    <AddCalculationModal
      modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
    />
  </RouterWrappedComponent>
);

const adminModalComponent = (
  <RouterWrappedComponent>
    <AddCalculationModal
      modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
      userIsAdmin={true}
    />
  </RouterWrappedComponent>
);

describe("AddCalculationModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal on initial render", () => {
    render(modalComponent);
    expect(
      screen.getByRole("heading", { name: "Add Sub Recipient" })
    ).toBeInTheDocument();
  });

  it("close button closes modal", async () => {
    render(modalComponent);
    const closeButton = screen.getByText("Close");
    await act(async () => {
      await userEvent.click(closeButton);
    });
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("submit button triggers form submission and closes modal", async () => {
    render(modalComponent);
    const submitButton = screen.getByTestId("modal-submit-button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("form is disabled when userIsAdmin is true", () => {
    render(adminModalComponent);
    const form = screen.getByTestId("add-calculation-form");
    const inputs = form.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("submitting the modal closes it", async () => {
    render(modalComponent);

    const submitButton = screen.getByTestId("modal-submit-button");
    await act(async () => {
      await userEvent.click(submitButton);
    });

    // Modal should close after submission
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});
