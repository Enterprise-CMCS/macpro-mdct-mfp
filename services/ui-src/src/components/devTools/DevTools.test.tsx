import { render, screen } from "@testing-library/react";
import { DevTools, ToolType } from "./DevTools";
import { useFlags } from "launchdarkly-react-client-sdk";
import userEvent from "@testing-library/user-event";
import { DevDashboardTools } from "./DevDashboardTools";
import { ReportType } from "types";
import { DevReportTools } from "./DevReportTools";

vi.mock("launchdarkly-react-client-sdk");
const mockFlags = vi.mocked(useFlags);
mockFlags.mockReturnValue({
  devTools: true,
});

vi.mock("./DevDashboardTools");
const mockDashboardTools = vi.mocked(DevDashboardTools);
vi.mock("./DevReportTools");
const mockReportTools = vi.mocked(DevReportTools);

const DevToolsDashboardType = (
  <DevTools
    state={"PA"}
    reload={() => {}}
    type={ToolType.DASHBOARD}
    reportType={ReportType.WP}
  />
);

const DevToolsReportType = (
  <DevTools state="PA" type={ToolType.REPORT} reportType={ReportType.WP} />
);

describe("Test DevTools component", () => {
  it("Dashboard type opens dashboard tools", async () => {
    render(DevToolsDashboardType);
    const devBtn = screen.getByRole("button", { name: "Dev Tools" });
    await userEvent.click(devBtn);
    expect(mockDashboardTools).toHaveBeenCalled();
  });
  it("Report type opens report tools", async () => {
    render(DevToolsReportType);
    const devBtn = screen.getByRole("button", { name: "Dev Tools" });
    await userEvent.click(devBtn);
    expect(mockReportTools).toHaveBeenCalled();
  });
});
