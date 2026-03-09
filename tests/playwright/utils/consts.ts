import { faker } from "@faker-js/faker";

export const adminUser = process.env.SEED_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.SEED_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const stateUser = process.env.SEED_STATE_USER_EMAIL!;
export const statePassword = process.env.SEED_STATE_USER_PASSWORD!; // pragma: allowlist secret

export const stateAbbreviation = process.env.SEED_STATE || "PR";
export const stateName = process.env.SEED_STATE_NAME || "Puerto Rico";
export const reportType = "WP";

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

const bannerStartDate = faker.date.soon({ days: 1 });
const bannerEndDate = new Date(bannerStartDate);
bannerEndDate.setDate(bannerEndDate.getDate() + 1);
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export const testBanner = {
  title: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  startDate: dateFormat.format(bannerStartDate),
  endDate: dateFormat.format(bannerEndDate),
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
export function generateQuarterValues(length: number): string[] {
  return Array.from({ length }, () => {
    // Randomly choose between integer string or 'N/A'
    return faker.datatype.boolean()
      ? faker.string.numeric(4) // generates up to 4 digits, including leading zeros
      : "N/A";
  });
}

export const transitionBenchmarkQuarterValues = generateQuarterValues(12);
export const initiativeFundingSourceQuarterValues = generateQuarterValues(12);

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
    explanation: faker.lorem.sentence(),
    additionalDetails: faker.lorem.paragraph(),
  },
  initiativesInstructions: {
    selfDirected: false,
    tribal: false,
  },
  initiatives: requiredWorkPlanTopics.map((topic) => ({
    name: topic.name,
    description: faker.lorem.sentence(),
    targetPopulations: ["Older adults"],
    startDate: currentDate,
    hasProjectedEndDate: false,
    evaluationPlan: {
      objective: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      targets: faker.lorem.sentence(),
      quantitativeTargets: false,
      additionalDetails: faker.lorem.paragraph(),
    },
    fundingSources: {
      source: "qualified HCBS and demonstration services",
      values: initiativeFundingSourceQuarterValues,
    },
  })),
};
