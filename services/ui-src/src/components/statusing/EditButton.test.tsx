import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/setupTest";
import { EditButton } from "./EditButton";

const EditButtonComponentNotEditable = (
  <RouterWrappedComponent>
    <EditButton
      buttonAriaLabel="label"
      path=""
      editable={false}
      showIcon={true}
    />
  </RouterWrappedComponent>
);

const EditButtonComponent = (
  <RouterWrappedComponent>
    <EditButton
      buttonAriaLabel="label"
      path=""
      editable={true}
      showIcon={true}
    />
  </RouterWrappedComponent>
);

describe("<EditButton />", () => {
  test("EditButton when not editable", () => {
    render(EditButtonComponentNotEditable);
    const viewButton = screen.getByRole("button");
    expect(viewButton).toHaveTextContent("View");
  });

  test("EditButton when editable", () => {
    render(EditButtonComponent);
    const editButton = screen.getByRole("button");
    expect(editButton).toHaveTextContent("Edit");
  });

  testA11yAct(EditButtonComponent);
});
