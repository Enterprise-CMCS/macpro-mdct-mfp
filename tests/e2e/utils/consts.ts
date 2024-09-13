export const adminUser = process.env.SEED_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.SEED_ADMIN_USER_PASSWORD!;
export const stateUser = process.env.SEED_STATE_USER_EMAIL!;
export const statePassword = process.env.SEED_STATE_USER_PASSWORD!;

export const stateAbbreviation = process.env.SEED_STATE || "PR";
export const stateName = process.env.SEED_STATE_NAME || "Puerto Rico";

export const firstPeriod: number = 1;
export const secondPeriod: number = 2;

export const currentYear: number = new Date().getFullYear();
