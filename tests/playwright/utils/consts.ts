export const adminUser = process.env.SEED_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.SEED_ADMIN_USER_PASSWORD!; // pragma: allowlist secret
export const stateUser = process.env.SEED_STATE_USER_EMAIL!;
export const statePassword = process.env.SEED_STATE_USER_PASSWORD!; // pragma: allowlist secret

/** The path to the file containing admin browser session data */
export const adminAuthPath = "playwright/.auth/admin.json";
/** The path to the file containing state user browser session data */
export const stateUserAuthPath = "playwright/.auth/user.json";

export const stateAbbreviation = process.env.SEED_STATE || "PR";
export const stateName = process.env.SEED_STATE_NAME || "Puerto Rico";

export const firstPeriod: number = 1;
export const secondPeriod: number = 2;

export const currentYear: number = new Date().getFullYear();
