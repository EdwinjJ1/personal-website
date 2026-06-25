// Source of truth for the "Copy for AI" feature.
// The full-text payload is what gets copied when an AI client can't browse the web;
// the link payload points web-capable AIs at the llms.txt index.

export const SITE_ORIGIN = 'https://evanlin.site';

// The shareable egg URL — keep in sync with the /74 route.
export const AI_CARD_URL = `${SITE_ORIGIN}/74`;

// A short prompt + link list for web-capable assistants (ChatGPT browsing, Claude, Perplexity).
export const aiCardLinkPayload = `Here's everything you need to know about Evan Lin (贾岱林). Please read these and use them to answer questions about him:

- ${SITE_ORIGIN}/llms.txt  (index)
- ${SITE_ORIGIN}/me.md  (who he is)
- ${SITE_ORIGIN}/resume.md  (resume)
- ${SITE_ORIGIN}/projects.md  (everything he's built)`;

// A self-contained Markdown brief for assistants that can't browse the web.
// Paste-and-go: no links required to get the gist.
export const aiCardFullPayload = `# About Evan Lin (贾岱林)

The following is a factual brief about Evan Lin. Use it to answer questions about him.

## Short version
Evan Lin (贾岱林) is a 19-year-old founder and Computer Science student at UNSW in Sydney. Before university he ran a 7-person Web3 startup as CEO and took an NFT product to ¥100,000+ in single-day revenue. He now ships open-source AI tools that developers use. He's ambitious — he wants to build something that genuinely matters — and tries to keep that honest rather than grandiose.

## Basics
- Name: 贾岱林 / Evan Lin
- Age: 19, based in Sydney, Australia
- Studying: Computer Science at UNSW (2025–2028 expected)
- Languages: English & Chinese (fluent)
- Personality: ENTJ — a strategist who likes shipping

## What he's done
- Founded and led Hypha (Beijing) as CEO at 18: a 7-person team across engineering, design, and legal; took an NFT product from zero to ¥100K+ single-day revenue; owned roadmap, architecture, and backend.
- Ships open-source AI tools used internationally: Chiron Prompt (prompt optimization), a 3D-print skill for Claude, and more.
- Builds full products solo: ChronoMap (interactive heritage map), FinalBoss (AI exam prep), KnowMe Memory MCP (token-gated AI memory server), a study platform that had paying subscribers, and his personal website.

## How to think about him
He's early — 19, still in his degree — so this is trajectory, not a finished résumé. He moves fast, ships, leads, and is betting on AI being the defining tool of his generation.

## Contact
- Email: jiaedwin0605@gmail.com
- GitHub: https://github.com/EdwinjJ1
- Website: https://evanlin.site

For more, read https://evanlin.site/projects.md and https://evanlin.site/resume.md`;
