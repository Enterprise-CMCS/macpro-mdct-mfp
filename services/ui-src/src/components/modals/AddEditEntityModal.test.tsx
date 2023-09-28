import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
//components
import { AddEditEntityModal } from "components";
import {
  mockModalDrawerReportPageVerbiage,
  mockModalForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
const mockCloseHandler = jest.fn();

const modalComponent = (
  <RouterWrappedComponent>
    <AddEditEntityModal
      entityType="plans"
      verbiage={mockModalDrawerReportPageVerbiage}
      form={mockModalForm}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </RouterWrappedComponent>
);

describe("Test AddEditEntityModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditEntityModal shows the contents", () => {
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.addEditModalAddTitle)
    ).toBeTruthy();
    expect(screen.getByText("mock modal text field")).toBeTruthy();
  });

  test("AddEditEntityModal cancel button closes modal", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditEntityModal close button closes modal", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
