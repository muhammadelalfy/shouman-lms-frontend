import { defineMcp } from "@lovable.dev/mcp-js";
import listTracks from "./tools/list-tracks";
import listPrograms from "./tools/list-programs";

export default defineMcp({
  name: "start-site-foundation",
  title: "Start Site Foundation",
  version: "0.1.0",
  instructions:
    "Public info about Dr. Hazem Shouman Academy (Arabic). Use list_tracks for learning tracks and list_programs for seasonal programs and initiatives.",
  tools: [listTracks, listPrograms],
});
