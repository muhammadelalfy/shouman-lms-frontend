import { defineTool } from "@lovable.dev/mcp-js";
import { tracks } from "../data";

export default defineTool({
  name: "list_tracks",
  title: "List learning tracks",
  description: "List the academy's learning tracks with descriptions and topics.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: tracks.map((t) => `${t.title}: ${t.description} (${t.topics.join("، ")})`).join("\n") }],
    structuredContent: { tracks: tracks.map((t) => ({ title: t.title, description: t.description, topics: [...t.topics] })) },
  }),
});
