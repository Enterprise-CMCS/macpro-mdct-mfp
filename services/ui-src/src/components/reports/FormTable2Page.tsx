import { Flex, Table, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react";
import { Form } from "components/forms/Form";
import { useState } from "react";
import { AnyObject, FormField } from "types";
import { useStore } from "utils";
import { statePlanServiceNames } from "../../constants";

const FormCell = ({
  field,
  onChangeHandler,
}: {
  field: FormField;
  onChangeHandler?: Function;
}) => {
  const { report } = useStore();

  const form = {
    id: field.id,
    fields: [field],
  };

  return (
    <Form
      id={form.id}
      formJson={form}
      formData={report?.fieldData}
      onSubmit={() => {}}
      onFormChange={onChangeHandler}
      onError={() => {}}
      autosave
      validateOnRender={false}
      dontReset={false}
    />
  );
};

const CalculationCell = ({ value }: { value?: number }) => {
  return <Text>{value ?? ""}</Text>;
};

const FormCalculationCell = ({
  field,
  total,
  percentage,
}: {
  field: FormField;
  total?: number;
  percentage?: number;
}) => {
  let [calculatedValue, setCalculatedValue] = useState(total);

  const onChangeHandler = (formProvider: AnyObject) => {
    const fieldValue = formProvider.getValues(field.id);
    if (fieldValue?.length > 0 && total && percentage) {
      setCalculatedValue((total * percentage) / 100);
    } else {
      setCalculatedValue(0);
    }
  };

  return (
    <Flex direction="row" alignItems="center">
      <FormCell field={field} onChangeHandler={onChangeHandler} />
      <CalculationCell value={calculatedValue} />
    </Flex>
  );
};

const formTableRow = (group: FormField[]) => {
  const { report } = useStore();
  let [totalValue, setTotalValue] = useState(0);

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  const numberField = group.find((field: FormField) => field.type === "number");
  const checkBoxFields = group.filter(
    (field: FormField) => field.type === "checkbox"
  );

  const onChangeHandler = (formProvider: AnyObject) => {
    const fieldValue = formProvider.getValues(numberField?.id);
    if (fieldValue > 0) {
      setTotalValue(fieldValue);
    } else {
      setTotalValue(0);
    }
  };

  return (
    <Tr>
      <Td>
        <FormCell field={numberField!} onChangeHandler={onChangeHandler} />
      </Td>
      <Td>
        <CalculationCell value={totalValue} />
      </Td>
      {checkBoxFields.map((checkBoxField: FormField) => {
        let percentage = 0;
        checkBoxField.id.includes("hcbs") ? (percentage = fmap1) : 0;
        checkBoxField.id.includes("demoServices") ? (percentage = fmap2) : 0;
        checkBoxField.id.includes("suppServices") ? (percentage = fmap3) : 0;
        return (
          <Td>
            <FormCalculationCell
              field={checkBoxField}
              total={totalValue}
              percentage={percentage}
            />
          </Td>
        );
      })}
      <Td>
        <CalculationCell value={totalValue} />
      </Td>
    </Tr>
  );
};

export const FormTable2Page = ({ route }: { route: AnyObject }) => {
  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  const serviceNames = statePlanServiceNames.map((name: string) =>
    name.replace(/\s+/g, "-").toLowerCase()
  );

  let serviceGroups = [];

  for (const name of serviceNames) {
    const setOfServiceInputs: FormField[] = route.form.fields.filter(
      (field: AnyObject) => field.id.includes(name)
    );
    serviceGroups.push(setOfServiceInputs);
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Td>Service</Td>
          <Td>Total State/Territory Share</Td>
          <Td>Qualified HCBS {fmap1}%</Td>
          <Td>Demo Services {fmap2}%</Td>
          <Td>Supplemental Services {fmap3}%</Td>
          <Td>Total Federal Share</Td>
        </Tr>
      </Thead>
      <Tbody>
        {serviceGroups.map((group: FormField[]) => formTableRow(group))}
      </Tbody>
    </Table>
  );
};
