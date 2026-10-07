import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { DropdownField } from "components";
// utils
import { mockFieldStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { mockDropdownOptions } from "utils/testing/fields/mockDropdownChoices";
import { testA11yAct } from "utils/testing/commonTests";

const mockHydrationValue = { label: "Option 3", value: "test-dropdown-3" };

const mockSetValue = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({ ...mockFieldStore, setAnswer: mockSetValue });

const dropdownComponentWithOptions = ({
  hint = "Dropdown hint",
  hydrate,
  name = "testDropdown",
  label = "test-dropdown-label",
  options = mockDropdownOptions,
  disabled = false,
}: any = {}) => (
  <DropdownField
    hint={hint}
    hydrate={hydrate}
    label={label}
    name={name}
    options={options}
    disabled={disabled}
  />
);

describe("<DropdownField />", () => {
  describe("Test DropdownField basic functionality", () => {
    test("Dropdown renders", () => {
      render(dropdownComponentWithOptions());
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown).toBeVisible();

      const hint = screen.getByText("Dropdown hint");
      expect(hint).toBeVisible();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(4);
    });

    test("renders empty options for copyEligibleReports", () => {
      const opts = { options: "copyEligibleReports" };
      render(dropdownComponentWithOptions(opts));
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });

    test("renders empty options for string value", () => {
      const opts = { options: "mock" };
      render(dropdownComponentWithOptions(opts));
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });

    test("calls change and blur events", async () => {
      render(dropdownComponentWithOptions());
      const dropDown = screen.getByLabelText("test-dropdown-label");
      await act(async () => {
        await userEvent.selectOptions(dropDown, "test-dropdown-1");
      });
      expect(mockSetValue).toHaveBeenCalled();
    });

    test("renders disabled dropdown when disabled prop is true", () => {
      const opts = { disabled: true };
      render(dropdownComponentWithOptions(opts));
      const dropdown = screen.getByLabelText("test-dropdown-label");
      expect(dropdown).toBeDisabled();
    });
  });

  describe("Test DropdownField hydration functionality", () => {
    test("If only hydrationValue exists, displayValue is set to it", () => {
      const opts = {
        label: "test-dropdown-field-to-hydrate",
        hydrate: mockHydrationValue,
      };
      render(dropdownComponentWithOptions(opts));
      const dropdownField = screen.getByLabelText(opts.label);
      expect(dropdownField).toHaveValue(mockHydrationValue.value);
    });
  });

  testA11yAct(dropdownComponentWithOptions());
});
