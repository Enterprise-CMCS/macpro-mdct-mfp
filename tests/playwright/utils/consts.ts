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

export const cognitoIdentityRoute = "https://cognito-identity.*.amazonaws.com/";

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

// 12 quarters starting from the current year
export const quarters = Array.from({ length: 12 }, (_, i) => {
  const year = new Date().getFullYear() + Math.floor(i / 4);
  const quarter = (i % 4) + 1;
  return `${year}Q${quarter}`;
});

// Valid data can be a dollar amount including zero or N/A
export const transitionBenchmarkQuarterValues = [
  "75",
  "N/A",
  "0",
  "0",
  "0",
  "0",
  "100",
  "0",
  "0",
  "750",
  "0",
  "0",
];

export const initiativeFundingSourceQuarterValues = [
  "1000",
  "100",
  "0",
  "0",
  "500",
  "600",
  "N/A",
  "750",
  "900",
  "0",
  "1100",
  "1200",
];

// Update dependent test data type to match string amounts
export const wpTransitionBenchmarkTestData: Array<{
  benchmarkName: string;
  isActive: boolean;
  quarterValues: string[];
}> = [
  {
    benchmarkName: transitionBenchmarks[0],
    isActive: true,
    quarterValues: transitionBenchmarkQuarterValues,
  },
  {
    benchmarkName: transitionBenchmarks[1],
    isActive: false,
    quarterValues: [],
  },
  {
    benchmarkName: transitionBenchmarks[2],
    isActive: false,
    quarterValues: [],
  },
  {
    benchmarkName: transitionBenchmarks[3],
    isActive: false,
    quarterValues: [],
  },
];

export type WorkPlan = {
  reportingYear: number;
  reportingPeriod: string;
  transitionBenchmarkProjections: Array<{
    benchmarkName: string;
    isActive: boolean;
    quarterValues: string[];
  }>;
  transitionBenchmarkStrategy: {
    explanation: string;
    additionalDetails: string;
  };
  initiativesInstructions: {
    selfDirected: boolean;
    tribal: boolean;
  };
  initiatives: Array<{
    name: string;
    description: string;
    targetPopulations: string[];
    startDate: string;
    hasProjectedEndDate: boolean;
    evaluationPlan: {
      objective: string;
      description: string;
      targets: string;
      quantitativeTargets: boolean;
      additionalDetails: string;
    };
    fundingSources: {
      source: string;
      values: string[];
    };
  }>;
};

export const fillWorkPlanTestData: WorkPlan = {
  reportingYear: currentYear,
  reportingPeriod: "First reporting period",
  transitionBenchmarkProjections: wpTransitionBenchmarkTestData,
  transitionBenchmarkStrategy: {
    explanation: "Test explanation",
    additionalDetails: "Test additional details",
  },
  initiativesInstructions: {
    selfDirected: false,
    tribal: false,
  },
  initiatives: requiredWorkPlanTopics.map((topic) => ({
    name: topic.name,
    description: "Test",
    targetPopulations: ["Older adults"],
    startDate: currentDate,
    hasProjectedEndDate: false,
    evaluationPlan: {
      objective: "Test Objective",
      description: "Test Description",
      targets: "Test Targets",
      quantitativeTargets: false,
      additionalDetails: "Test Additional Details",
    },
    fundingSources: {
      source: "qualified HCBS and demonstration services",
      values: initiativeFundingSourceQuarterValues,
    },
  })),
};
