import "server-only";
export type TrialCredentials = { email: string; password: string };
/** Only an explicitly provisioned, intentionally shared local student account may be exposed. */
export function getTrialCredentials(): TrialCredentials | undefined {
  const email = process.env.TRIAL_LOGIN_EMAIL;
  const password = process.env.TRIAL_LOGIN_PASSWORD;
  if (process.env.TRIAL_LOGIN_ENABLED !== "true" || !email || !password || !/^trial-[a-z0-9]+@integration\.example\.invalid$/.test(email)) return undefined;
  return { email, password };
}

/** A dedicated shared admin account is available only in explicitly enabled local demos. */
export function getAdminTrialCredentials(): TrialCredentials | undefined {
  const email = process.env.ADMIN_TRIAL_LOGIN_EMAIL;
  const password = process.env.ADMIN_TRIAL_LOGIN_PASSWORD;
  if (process.env.LOCAL_DEMO_MODE !== "true" || process.env.ADMIN_TRIAL_LOGIN_ENABLED !== "true" || !email || !password || !/^trial-admin-[a-z0-9]+@integration\.example\.invalid$/.test(email)) return undefined;
  return { email, password };
}
