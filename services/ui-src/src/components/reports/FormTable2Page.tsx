import { Flex, Table, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react"
import { Form } from "components/forms/Form";
import { useState } from "react";
import { AnyObject, FormField, FormJson } from "types"
import { useStore } from "utils";
import { statePlanServiceNames } from "../../constants";

const FormCell = ({form, onChangeHandler}: {form: FormJson, onChangeHandler: Function}) => {
  const { report } = useStore();
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
    )
  }

  const CalculationCell = ({value}: {value: number}) => {
    return <Text>{value}</Text>
  }

  const FormCalculationCell = ({form, value, onChangeHandler }: {form: FormJson, value: number, onChangeHandler: Function}) => {
    return (
      <Flex direction="row" align-items="center">
        <FormCell form={form} onChangeHandler={onChangeHandler} />
        <CalculationCell value={value} />
      </Flex>
    )
  }

const formTableRow = (group: FormField[]) => {
  const { report } = useStore();
  const [qualHcbsVal, setQualHcbsVal] = useState(0);
  const [demoServicesVal, setDemoServicesVal] = useState(0);
  const [suppServicesVal, setSuppServicesVal] = useState(0);

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  // since each form is separate now it lags behind in updating the display values. need a fix.
  const onChangeHandler = (formProvider: AnyObject) => {
    //pulling the fields needed to build the entity to check the status of
    let fields = group.flatMap((field: any) => {
      return { id: field.id, value: formProvider.getValues(field.id) };
    });
    
    // if fmap-checkbox-1, 2, 3 has non empty array then apply calc'
    const numberVal = fields[0].value ?? data?.[fields[0].id];
    const fmapFields = fields.filter((field: AnyObject) => field.id.includes("fmap-"));
    const checkedFmaps = fmapFields?.filter((field: AnyObject) => field?.value?.length > 0);
    const checkedFmapIds = checkedFmaps.map((field: AnyObject) => field.id.split("-")[1]);

    const qualHcbs = (checkedFmapIds.includes("hcbs") && fmap1 > 0) ? (numberVal * fmap1) / 100 : 0;
    const demoServices = (checkedFmapIds.includes("demoServices") && fmap2 > 0) ? (numberVal * fmap2) / 100 : 0;
    const suppServices = (checkedFmapIds.includes("suppServices") && fmap3 > 0) ? (numberVal * fmap3) / 100 : 0;

    setQualHcbsVal(qualHcbs);
    setDemoServicesVal(demoServices);
    setSuppServicesVal(suppServices);
  };

  const firstField = {
    id: group[0].id,
    fields: [group[0]]
  }
  const secondField = {
    id: group[1].id,
    fields: [group[1]]
  }
  const thirdField = {
    id: group[2].id,
    fields: [group[2]]
  }
  const fourthField = {
    id: group[3].id,
    fields: [group[3]]
  }

  return (
    <Tr>
      <Td>
        <FormCell form={firstField} onChangeHandler={onChangeHandler} />
      </Td>
      <Td><CalculationCell value={0} /></Td>
      <Td>
        <FormCalculationCell form={secondField} value={qualHcbsVal} onChangeHandler={onChangeHandler} />
      </Td>
      <Td>
        <FormCalculationCell form={thirdField} value={demoServicesVal} onChangeHandler={onChangeHandler} />
      </Td>
      <Td>
        <FormCalculationCell form={fourthField} value={suppServicesVal} onChangeHandler={onChangeHandler} />
      </Td>
      <Td><CalculationCell value={0} /></Td>
    </Tr>
  )
}

export const FormTable2Page = ({route}: {route: AnyObject}) => {
  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  const serviceNames = statePlanServiceNames.map((name: string) => name.replace(/\s+/g, '-').toLowerCase());

  let serviceGroups = [];

  for (const name of serviceNames) {
    const setOfServiceInputs: FormField[] = route.form.fields.filter((field: AnyObject) => field.id.includes(name));
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
}