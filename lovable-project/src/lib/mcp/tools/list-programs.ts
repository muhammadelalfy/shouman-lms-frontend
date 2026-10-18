import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { initiatives, seasonal } from "../data";

export default defineTool({
  name: "list_programs",
  title: "List programs and initiatives",
  description: "List the academy's seasonal programs and intensive initiatives.",
  inputSchema: {
    kind: z.enum(["all", "seasonal", "initiatives"]).optional().describe("Which group to return; defaults to all."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ kind = "all" }) => {
    const s = kind === "initiatives" ? [] : seasonal.map((p) => ({ ...p, kind: "seasonal" }));
    const i = kind === "seasonal" ? [] : initiatives.map((p) => ({ ...p, kind: "initiative" }));
    const programs = [...s, ...i];
    return {
      content: [{ type: "text", text: programs.map((p) => `[${p.kind}] ${p.title}: ${p.description}`).join("\n") }],
      structuredContent: { programs },
    };
  },
});
