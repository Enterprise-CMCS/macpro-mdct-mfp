import { Button, Divider, Box } from "@chakra-ui/react";
import { TextField } from "@cmsgov/design-system";
import { useState } from "react";
import { DropdownOptions } from "types";

interface Props {
  reload?: Function;
  state?: string;
  datasets: DropdownOptions[];
}

export const DevDashboardTools = ({ reload, state, datasets }: Props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [amount, setAmount] = useState<number>(0);

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setAmount(parseInt(newValue));
  };

  const runUpload = async () => {
    if (!file || datasets.length === 0) return;

    setLoading(true);
    if (reload) reload();
    setLoading(false);
  };

  const onGenerateUploads = () => {
    runUpload();
    setFile(undefined);
    setAmount(0);
  };

  const onDeleteAll = async () => {
    setLoading(true);
    if (!state) return;
    if (reload) reload();
    setLoading(false);
  };

  return (
    <>
      <Box>Dataset: Randomize</Box>
      <TextField
        name={"amount"}
        label="Amount To Generate:"
        onChange={onTextChange}
        value={amount}
        numeric
      ></TextField>
      <Button onClick={onGenerateUploads} disabled={loading}>
        Generate Uploads
      </Button>
      <Divider />
      <Button onClick={onDeleteAll} disabled={loading}>
        Delete All Uploads
      </Button>
    </>
  );
};
