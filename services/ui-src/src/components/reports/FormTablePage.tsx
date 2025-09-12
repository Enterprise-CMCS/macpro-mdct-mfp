import { Flex, Text } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import { object as yupSchema } from "yup";
import { FormProvider, useForm } from "react-hook-form"
import { AnyObject, FormField, isFieldElement } from "types"
import { compileValidationJsonFromFields, formFieldFactory, mapValidationTypesToSchema, useStore } from "utils";
import { useState } from "react";

const formTableRow = (formFields: FormField[], route: AnyObject, data: AnyObject | undefined, fmap1: number, fmap2: number, fmap3: number) => {
  const [qualHcbsVal, setQualHcbsVal] = useState(0);
  const [demoServicesVal, setDemoServicesVal] = useState(0);
  const [suppServicesVal, setSuppServicesVal] = useState(0);

  const formValidationJson = compileValidationJsonFromFields(
    formFields.filter(isFieldElement)
  );
  const formValidationSchema = mapValidationTypesToSchema(formValidationJson);
  const formResolverSchema = yupSchema(formValidationSchema || {});
  const form = useForm({
    resolver: yupResolver(formResolverSchema),
    shouldFocusError: false,
    mode: "onChange",
  });

  const onChange = () => {
    let fields = formFields.flatMap((field: any) => {
      return { id: field.id, value: form.getValues(field.id) };
    });
    const fieldIndex = fields.findIndex((field: AnyObject) => field.id === fields[0].id);
    const val = fields[fieldIndex].value ?? data?.[fields[0].id];

    const fmapFields = fields.filter((field: AnyObject) => field.id.includes("fmap"));
    const checkedFmaps = fmapFields?.filter((field: AnyObject) => field?.value?.length > 0);
    const checkedFmapIds = checkedFmaps.map((field: AnyObject) => field.id.split("-")[1]);

    const qualHcbs = (checkedFmapIds.includes("hcbs") && fmap1 > 0) ? (val * fmap1) / 100 : 0;
    const demoServices = (checkedFmapIds.includes("demoServices") && fmap2 > 0) ? (val * fmap2) / 100 : 0;
    const suppServices = (checkedFmapIds.includes("suppServices") && fmap3 > 0) ? (val * fmap3) / 100 : 0;

    setQualHcbsVal(qualHcbs);
    setDemoServicesVal(demoServices);
    setSuppServicesVal(suppServices);
  };

  return (
    <FormProvider {...form}>
      <form
        id={route.form.id}
        onChange={onChange}
        autoComplete="off"
        onSubmit={() => {}}
      >
        <Flex direction="row" justifyContent="space-between">
          <>{formFieldFactory([formFields[0]])}</>
          <Flex justifyContent="space-around" alignItems="center">{formFieldFactory([formFields[1]])}<Text>{qualHcbsVal}</Text></Flex>
          <Flex justifyContent="space-around" alignItems="center">{formFieldFactory([formFields[2]])}<Text>{demoServicesVal}</Text></Flex>
          <Flex justifyContent="space-around" alignItems="center">{formFieldFactory([formFields[3]])}<Text>{suppServicesVal}</Text></Flex>
        </Flex>
      </form>
    </FormProvider>
  )
}

export const FormTablePage = ({ route }: AnyObject) => {
  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  const firstRowFields = [
    route.form.fields[0],
    route.form.fields[1],
    route.form.fields[2],
    route.form.fields[3]
  ];

  return (
    <Flex direction="column">
      <Flex direction="row" justifyContent="space-between" marginBottom="2rem">
        <Text width="20rem">Service</Text>
        <Text>Qualified HCBS {fmap1}%</Text>
        <Text>Demo Services {fmap2}%</Text>
        <Text>Supplemental Services {fmap3}%</Text>
      </Flex>
      {formTableRow(firstRowFields, route, data, fmap1, fmap2, fmap3)}
    </Flex>
  );
}