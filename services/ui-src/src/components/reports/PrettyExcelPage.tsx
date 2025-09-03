import { useContext, useState } from "react";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { ReportContext } from "./ReportProvider";
import { ReportStatus } from "types";
import { useStore } from "utils";

/*
 * current limitations:
 *  - hydration
 *  - save (saved data is erased after failing validation (since no fields assigned))
 *  - no solution for custom services
 *  - still hooking back into existing system, just shortcutting validation and react-hook-form
 *  - solution does not handle overlay/new pages per service type
 */

const services = [
  "Clinic Services",
  "Targeted Case Management",
  "PACE",
  "Rehab Services",
];

const serviceRow = (
  service: string,
  fmap1: number,
  fmap2: number,
  fmap3: number
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

  const onChangeHandler = (event: any) => {
    const val = event.target.value;
    const qualHcbs = fmap1 > 0 ? (val * fmap1) / 100 : 0;
    const demoServices = fmap2 > 0 ? (val * fmap2) / 100 : 0;
    const suppServices = fmap3 > 0 ? (val * fmap3) / 100 : 0;
    setNumberVal(val);
    setQualHcbsVal(qualHcbs);
    setDemoServicesVal(demoServices);
    setSuppServicesVal(suppServices);

    setStateTerritoryShareVal(val - qualHcbs - demoServices - suppServices);
    setFederalShareVal(qualHcbs + demoServices + suppServices);
  };

  const onBlurHandler = async () => {
    const dataSet = {
      service,
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
        services: {
          ...fieldData.services,
          ...dataSet,
        },
      },
    };

    await updateReport(reportKeys, dataToWrite);
    // autosave dataSet
  };

  return (
    <Tr>
      <Td>{service}</Td>
      <Td>
        <input
          type="number"
          id="text 1"
          name={`${service}_value`}
          style={{ border: "1px solid black" }}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
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

export const PrettyExcelPage = () => {
  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);

  return (
    <form>
      <Table>
        <Thead>
          <Tr>
            <Td>Service</Td>
            <Td>Total Computable</Td>
            <Td>Total State/Territory Share</Td>
            <Td>Qualified HCBS {fmap1}%</Td>
            <Td>Demo Services {fmap2}%</Td>
            <Td>Supplemental Services {fmap3}%</Td>
            <Td>Total Federal Share</Td>
          </Tr>
        </Thead>
        <Tbody>
          {services.map((service: string) =>
            serviceRow(service, fmap1, fmap2, fmap3)
          )}
        </Tbody>
      </Table>
    </form>
  );
};
