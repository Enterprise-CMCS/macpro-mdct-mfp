import { TransitionBenchmarkQuarter, TransitionBenchmarks } from "./types";

export const adminUser = process.env.SEED_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.SEED_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const stateUser = process.env.SEED_STATE_USER_EMAIL!;
export const statePassword = process.env.SEED_STATE_USER_PASSWORD!; // pragma: allowlist secret

export const stateAbbreviation = process.env.SEED_STATE || "PR";
export const stateName = process.env.SEED_STATE_NAME || "Puerto Rico";

export const firstPeriod: number = 1;
export const secondPeriod: number = 2;

export const currentYear: number = new Date().getFullYear();
export const currentDate: string = new Date().toLocaleDateString("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export const adminAuthPath: string = "playwright/.auth/admin.json";
export const stateUserAuthPath: string = "playwright/.auth/user.json";

export const expectedAdminHeading = "View State/Territory Reports";
export const expectedStateUserHeading = "Money Follows the Person (MFP) Portal";

export const testWorkPlan = {
  reportingYear: currentYear,
  reportingPeriod: "First reporting period",
  expName: `Puerto Rico MFP Work Plan ${currentYear} - Period 1`,
  expStatus: "Not started",
};

export const testBanner = {
  title: "Newly Created Banner",
  description: "Banner Description Text",
  startDate: "10/10/2025",
  endDate: "10/20/2025",
};

export const a11yViewports = {
  mobile: { width: 560, height: 800 },
  tablet: { width: 880, height: 1000 },
  desktop: { width: 1200, height: 1200 },
};

export const a11yTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "section508",
  "best-practice",
];

export const transitionBenchmarks = [
  "Older adults",
  "Individuals with physical disabilities",
  "Individuals with intellectual and developmental disabilities",
  "Individuals with mental health and substance use disorders",
];

export const workPlanTopics = [
  "Transitions and transition coordination services",
  "Housing-related supports",
  "Quality measurement and improvement",
  "Self-direction",
  "Tribal Initiative",
  "Recruitment and enrollment",
  "Person-centered planning and services",
  "No Wrong Door systems",
  "Community transition support",
  "Direct service workforce and caregivers",
  "Employment support",
  "Convenient and accessible transportation options",
  "Data-based decision-making",
  "Financing approaches",
  "Stakeholder engagement",
  "Equity and social determinants of health (SDOH)",
  "Other, specify",
];

export const requiredWorkPlanTopics = [
  { topic: workPlanTopics[0], name: "Initiative01" },
  { topic: workPlanTopics[1], name: "Initiative02" },
  { topic: workPlanTopics[2], name: "Initiative03" },
];

export const transitionBenchmarkQuarters: TransitionBenchmarkQuarter[] = [
  { quarter: "2025Q1", value: "75" },
  { quarter: "2025Q2", value: "0" },
  { quarter: "2025Q3", value: "0" },
  { quarter: "2025Q4", value: "0" },
  { quarter: "2026Q1", value: "0" },
  { quarter: "2026Q2", value: "0" },
  { quarter: "2026Q3", value: "0" },
  { quarter: "2026Q4", value: "0" },
  { quarter: "2027Q1", value: "0" },
  { quarter: "2027Q2", value: "0" },
  { quarter: "2027Q3", value: "0" },
  { quarter: "2027Q4", value: "0" },
];

export const wpTransitionBenchmarkTestData: TransitionBenchmarks[] = [
  {
    benchmarkName: transitionBenchmarks[0],
    isActive: true,
    quarters: transitionBenchmarkQuarters,
  },
  { benchmarkName: transitionBenchmarks[1], isActive: false, quarters: [] },
  { benchmarkName: transitionBenchmarks[2], isActive: false, quarters: [] },
  { benchmarkName: transitionBenchmarks[3], isActive: false, quarters: [] },
];
