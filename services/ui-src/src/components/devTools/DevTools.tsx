import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { DevDashboardTools } from "./DevDashboardTools";
import { useState } from "react";
import { ReportType } from "types";
import { DevReportTools } from "./DevReportTools";

interface Props {
  type: ToolType;
  reload?: Function;
  state?: string;
  reportType: ReportType;
}

export enum ToolType {
  DASHBOARD = "dashboard",
  ADMIN_DASHBOARD = "adminDashboard",
  REPORT = "report",
}

export const DevTools = ({ type, reload, state, reportType }: Props) => {
  const devTools = useFlags()?.devTools;
  if (!devTools) return;

  const [showOptions, setShowOptions] = useState<boolean>();

  return (
    <Box sx={sx.container} top={type === ToolType.REPORT ? "156px" : "96px"}>
      <Button sx={sx.primaryBtn} onClick={() => setShowOptions(!showOptions)}>
        <Text transform="rotate(-90deg)" color="white">
          Dev Tools
        </Text>
      </Button>
      {showOptions && (
        <Stack sx={sx.menuBox} gap="1rem">
          {type === ToolType.DASHBOARD && (
            <DevDashboardTools
              state={state}
              reload={reload}
              reportType={reportType}
            />
          )}
          {type === ToolType.REPORT && <DevReportTools></DevReportTools>}
        </Stack>
      )}
    </Box>
  );
};

const sx = {
  container: {
    position: "fixed",
    display: "flex",
    right: "0",
    zIndex: "1001",
    alignItems: "flex-start",
    maxHeight: "600px",
  },
  menuBox: {
    background: "white",
    border: "1px solid grey",
    height: "100%",
    width: "300px",
    padding: "12px",
    borderRadius: "0px 0px 0px 12px",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.1)",
    minHeight: "110px",
    maxHeight: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  primaryBtn: {
    width: "40px",
    height: "100px",
    borderRadius: "12px 0px 0px 12px",
  },
};
