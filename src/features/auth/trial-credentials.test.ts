import { afterEach, expect, it, vi } from "vitest";
import { getTrialCredentials, getAdminTrialCredentials } from "./trial-credentials";
afterEach(() => vi.unstubAllEnvs());
it("keeps trial credentials disabled by default", () => {
  vi.stubEnv("TRIAL_LOGIN_ENABLED", "false");
  expect(getTrialCredentials()).toBeUndefined();
});
it("exposes only an explicitly enabled local trial account", () => {
  vi.stubEnv("TRIAL_LOGIN_ENABLED", "true");
  vi.stubEnv("TRIAL_LOGIN_EMAIL", "trial-test@integration.example.invalid");
  vi.stubEnv("TRIAL_LOGIN_PASSWORD", "public-trial-password");
  expect(getTrialCredentials()?.email).toBe("trial-test@integration.example.invalid");
  vi.stubEnv("TRIAL_LOGIN_EMAIL", "admin@example.com");
  expect(getTrialCredentials()).toBeUndefined();
});

it("requires local-demo mode and a reserved admin account before exposing admin credentials", () => {
  vi.stubEnv("ADMIN_TRIAL_LOGIN_ENABLED", "true");
  vi.stubEnv("ADMIN_TRIAL_LOGIN_EMAIL", "trial-admin-local@integration.example.invalid");
  vi.stubEnv("ADMIN_TRIAL_LOGIN_PASSWORD", "shared-local-admin-password");
  vi.stubEnv("LOCAL_DEMO_MODE", "false");
  expect(getAdminTrialCredentials()).toBeUndefined();
  vi.stubEnv("LOCAL_DEMO_MODE", "true");
  expect(getAdminTrialCredentials()?.email).toBe("trial-admin-local@integration.example.invalid");
  vi.stubEnv("ADMIN_TRIAL_LOGIN_EMAIL", "admin@example.com");
  expect(getAdminTrialCredentials()).toBeUndefined();
  vi.stubEnv("ADMIN_TRIAL_LOGIN_ENABLED", "false");
  expect(getAdminTrialCredentials()).toBeUndefined();
});
