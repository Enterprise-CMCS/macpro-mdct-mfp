import { useContext, useState } from "react";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { ReportContext } from "./ReportProvider";
import { AnyObject, ReportStatus } from "types";
import { useStore } from "utils";
import { Form } from "components/forms/Form";

const serviceRow = (
  service: AnyObject,
  fmap1: number,
  fmap2: number,
  fmap3: number,
  route: any
) => {
  const { full_name, state } = useStore()?.user || {};
  const { report } = useStore();
  const { id, reportType, fieldData } = report!;
  const { updateReport } = useContext(ReportContext);
  const [numberVal, setNumberVal] = useState(0);
  const [stateTerritoryShareVal, setStateTerritoryShareVal] = useState(0);
  const [qualHcbsVal, setQualHcbsVal] = useState(0);
  const [demoServicesVal, setDemoServicesVal] = useState(0);
  const [suppServicesVal, setSuppServicesVal] = useState(0);
  const [federalShareVal, setFederalShareVal] = useState(0);

  const serviceIdentifier = service.id.split("service-")[1];
  const customForm = structuredClone(route.form);
  customForm.fields = route.form.fields.filter((field: AnyObject) => field.id.includes(serviceIdentifier));

  const onChangeHandler = (formProvider: AnyObject) => {
    //pulling the fields needed to build the entity to check the status of
    let fields = route.form.fields.flatMap((field: any) => {
      return { id: field.id, value: formProvider.getValues(field.id) };
    });
    
    // if fmap-checkbox-1, 2, 3 has non empty array then apply calc'
    const fieldIndex = fields.findIndex((field: AnyObject) => field.id === service.id);
    const val = fields[fieldIndex].value ?? fieldData?.[service.id];

    const fmapFields = fields.filter((field: AnyObject) => field.id === `fmap-${serviceIdentifier}`);
    const checkedFmaps = fmapFields?.[0]?.value?.map((checkedItem: AnyObject) => checkedItem.key.split("-").pop());

    const qualHcbs = (checkedFmaps.includes("qualHcbs") && fmap1 > 0) ? (val * fmap1) / 100 : 0;
    const demoServices = (checkedFmaps.includes("demoServices") && fmap2 > 0) > 0 ? (val * fmap2) / 100 : 0;
    const suppServices = (checkedFmaps.includes("suppServices") && fmap3 > 0) > 0 ? (val * fmap3) / 100 : 0;
    setNumberVal(val);
    setQualHcbsVal(qualHcbs);
    setDemoServicesVal(demoServices);
    setSuppServicesVal(suppServices);

    setStateTerritoryShareVal(val - qualHcbs - demoServices - suppServices);
    setFederalShareVal(qualHcbs + demoServices + suppServices);
  };

  const onSubmit = async () => {
    const dataSet = {
      service: service.props.label,
      totalComputable: numberVal,
      qualHcbs: qualHcbsVal,
      demoServices: demoServicesVal,
      suppServices: suppServicesVal,
    };

    const reportKeys = { reportType, id, state };

    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: full_name },
      fieldData: {
        ...fieldData,
        [service.id]: {
          ...dataSet
        },
      },
    };

    // autosave dataSet
    await updateReport(reportKeys, dataToWrite);
  };

  const onError = () => {};

  return (
    <Tr>
      <Td>
        <Form
          id={service.id}
          formJson={customForm}
          onSubmit={onSubmit}
          onFormChange={onChangeHandler}
          onError={onError}
          formData={report?.fieldData}
          autosave
          validateOnRender={false}
          dontReset={false}
        />
      </Td>
      <Td>{stateTerritoryShareVal}</Td>
      <Td>{qualHcbsVal}</Td>
      <Td>{demoServicesVal}</Td>
      <Td>{suppServicesVal}</Td>
      <Td>{federalShareVal}</Td>
    </Tr>
  );
};

export const PrettyExcelPage = ({route}: AnyObject) => {
  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  const serviceFields = route.form.fields.filter((field: AnyObject) => field.id.startsWith("service-"));

  return (
    // <form>
      <Table>
        <Thead>
          <Tr>
            <Td>Total Computable</Td>
            <Td>Total State/Territory Share</Td>
            <Td>Qualified HCBS {fmap1}%</Td>
            <Td>Demo Services {fmap2}%</Td>
            <Td>Supplemental Services {fmap3}%</Td>
            <Td>Total Federal Share</Td>
          </Tr>
        </Thead>
        <Tbody>
          {serviceFields.map((service: AnyObject) =>
            serviceRow(service, fmap1, fmap2, fmap3, route)
          )}
        </Tbody>
      </Table>
    // </form>
  );
};
