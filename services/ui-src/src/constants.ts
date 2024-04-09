// BANNERS
export const bannerId = "admin-banner-id";

// HOST DOMAIN
export const PRODUCTION_HOST_DOMAIN = "mdctmfp.cms.gov";

// FIELDS
export const dropdownDefaultOptionText = "- Select an option -";

export const closeText = "Close";
export const saveAndCloseText = "Save & close";
export const notAnsweredText = "Not answered";

// STATES
export enum States {
  AL = "Alabama",
  AK = "Alaska",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FL = "Florida",
  GA = "Georgia",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
}

// DEFAULT TARGET POPULATIONS
export const DEFAULT_TARGET_POPULATIONS = [
  {
    id: "2Vd02CVUtKgBETwqzDXpSIhi",
    transitionBenchmarks_targetPopulationName: "Older adults",
    isRequired: true,
  },
  {
    id: "2Vd02HAezQkxNu2ShmlQONHa",
    transitionBenchmarks_targetPopulationName:
      "Individuals with physical disabilities (PD)",
    transitionBenchmarks_targetPopulationName_short: "PD",
    isRequired: true,
  },
  {
    id: "2Vd02IvLwE59ebYAjfiU7H66",
    transitionBenchmarks_targetPopulationName:
      "Individuals with intellectual and developmental disabilities (I/DD)",
    transitionBenchmarks_targetPopulationName_short: "I/DD",
    isRequired: true,
  },
  {
    id: "2Vd02J1FHl3Ka1DbtU5FMSDh",
    transitionBenchmarks_targetPopulationName:
      "Individuals with mental health and substance use disorders (MH/SUD)",
    transitionBenchmarks_targetPopulationName_short: "MH/SUD",
    isRequired: true,
  },
];

// TIMEOUT PARAMS
export const IDLE_WINDOW = 30 * 60 * 1000; // ms
export const PROMPT_AT = 29 * 60 * 1000; //ms
