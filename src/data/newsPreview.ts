export const newsPreview = {
  latestDate: '2026-06-14',
  latestLabel: 'June 14, 2026',
  items: [
    {
      id: 'research-20260614-0000-agents-k1-towards-agent-native-knowledge-orchestration',
      title: 'Agents-K1: Towards Agent-native Knowledge Orchestration',
      tag: 'RESEARCH',
      date: '2026-06-14',
      time: '00:00',
      category: 'research',
    },
    {
      id: 'research-20260614-0000-hypertool-beyond-step-wise-tool-calls-for-tool-augmented-agents',
      title: 'HyperTool: Beyond Step-Wise Tool Calls for Tool-Augmented Agents',
      tag: 'RESEARCH',
      date: '2026-06-14',
      time: '00:00',
      category: 'research',
    },
    {
      id: 'research-20260614-0000-mana-dexterous-manipulation-of-articulated-tools',
      title: 'Mana: Dexterous Manipulation of Articulated Tools',
      tag: 'RESEARCH',
      date: '2026-06-14',
      time: '00:00',
      category: 'research',
    },
  ],
} as const;

export type NewsPreviewItem = (typeof newsPreview.items)[number];
