export type WorkspaceRoute = "admin" | "dashboard" | "learning";
export function resolveWorkspaceRoute(path: string[]): WorkspaceRoute | null {
  const key = path.join("/");
  if (key === "admin" || key === "admin/dashboard") return "admin";
  if (key === "dashboard") return "dashboard";
  if (key === "my-learning" || key === "learning") return "learning";
  return null;
}
