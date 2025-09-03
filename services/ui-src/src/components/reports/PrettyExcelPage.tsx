import { useState } from "react";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { useStore } from "utils";

const services = [
  "Clinic Services",
  "Targeted Case Management",
  "PACE",
  "Rehab Services"
];

const serviceRow = (service, fmap1, fmap2, fmap3) => {
  const [numberVal, setNumberVal] = useState(0);

  const onChangeHandler = (event: any) => {
    const val = event.target.value;
    setNumberVal(val);
  }

  return (
    <Tr>
      <Td>{service}</Td>
      <Td><input type="number" id="text 1" name={`${service}_value`} style={{border: "1px solid black"}} onChange={onChangeHandler}/></Td>
      <Td>{numberVal > 0 ? `${numberVal * fmap1 / 100}` : "0"}</Td>
      <Td>{numberVal > 0 ? `${numberVal * fmap2 / 100}` : "0"}</Td>
      <Td>{numberVal > 0 ? `${numberVal * fmap3 / 100}` : "0"}</Td>
    </Tr>
  )
}

export const PrettyExcelPage = () => {

  const { report } = useStore();

  const data = report?.fieldData;

  const fmap1 = Number(data?.eFmap_qualified_hcbs || 0);
  const fmap2 = Number(data?.eFmap_demo_services || 0);
  const fmap3 = Number(data?.supplemental_services || 0);


  return <form><Table>
    <Thead><Tr><Td>Service</Td><Td>Text Input</Td><Td>FMAP 1 {fmap1}%</Td><Td>FMAP 2 {fmap2}%</Td><Td>FMAP 3 {fmap3}%</Td></Tr></Thead>
  <Tbody>
    {services.map((service: string) => serviceRow(service, fmap1, fmap2, fmap3))}
  </Tbody>
  
  
  </Table>
  </form>;
}