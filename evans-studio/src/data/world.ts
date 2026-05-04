export type PanelId = "studio" | "photo" | "game" | "broadcast" | null;

export type HotspotId = Exclude<PanelId, null>;

export type WorldHotspot = {
  id: HotspotId;
  label: string;
  action: string;
  x: number;
  y: number;
  radius: number;
};

export const worldHotspots: WorldHotspot[] = [
  {
    id: "photo",
    label: "摄影工作室",
    action: "进入摄影工作室",
    x: 470,
    y: 420,
    radius: 210,
  },
  {
    id: "studio",
    label: "Evan Studio",
    action: "进入玻璃工作室",
    x: 1850,
    y: 410,
    radius: 220,
  },
  {
    id: "game",
    label: "互动小游戏",
    action: "进入像素小游戏",
    x: 520,
    y: 1380,
    radius: 220,
  },
  {
    id: "broadcast",
    label: "OpenClaw 电视塔",
    action: "查看新闻和广播",
    x: 1835,
    y: 1390,
    radius: 280,
  },
];

export const projectCards = [
  {
    title: "EgoTrace",
    type: "AI memory system",
    detail: "A structured memory and behavior tracing workspace for long-running AI workflows.",
    accent: "#71f2ff",
  },
  {
    title: "preuni.xyz",
    type: "Education platform",
    detail: "A focused product surface for study planning, practice, and student workflow design.",
    accent: "#f8c35f",
  },
  {
    title: "Hangtola",
    type: "Builder tool",
    detail: "A compact maker project represented as a terminal node inside Evan Studio.",
    accent: "#77ffab",
  },
];

export const photoCards = [
  {
    title: "Night Window",
    detail: "Low-light composition, glass reflection, and quiet city geometry.",
  },
  {
    title: "Metropolis",
    detail: "Urban scale study for the right-bottom city expansion zone.",
  },
  {
    title: "Chiaroscuro",
    detail: "Hard light and shadow reference for the photography studio.",
  },
];

export const broadcastItems = [
  "Powered by OpenClaw: new studio map online.",
  "Evan Web broadcast tower is ready for future building expansions.",
  "News surface, project dispatches, and AI notes live here.",
];

export const gameNotes = [
  "Mini game v1: a compact arcade terminal in the lower-left zone.",
  "Score is local to this visit and does not need a backend.",
  "The area is intentionally expandable into more game rooms later.",
];
