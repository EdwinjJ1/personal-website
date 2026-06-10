#!/usr/bin/env node

/**
 * Fetches real GitHub contribution calendar data and writes it to
 * src/data/github-activity.json for static builds.
 *
 * Strategy:
 *   1. GraphQL API when GITHUB_TOKEN is set and valid (exact data).
 *   2. Fallback: parse the public contributions page — no token needed,
 *      same calendar GitHub renders on the profile.
 *
 * Usage: node scripts/fetch-github-activity.js   (GITHUB_TOKEN optional)
 */

const fs = require('fs');
const path = require('path');

const USERNAME = 'EdwinjJ1';
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'github-activity.json');

function writeOutput(days, total, source) {
  const data = {
    totalContributions: total,
    days,
    fetchedAt: new Date().toISOString(),
    source,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log(`Wrote ${days.length} days, ${total} total contributions to ${OUTPUT} (source: ${source})`);
}

async function fetchViaGraphQL(token) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username: USERNAME } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));

  writeOutput(days, calendar.totalContributions, 'graphql');
}

// Public profile calendar — same data, no auth required.
async function fetchViaPublicPage() {
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (personal-website build script)' },
  });
  if (!res.ok) {
    throw new Error(`Public contributions page error: ${res.status} ${res.statusText}`);
  }
  const html = await res.text();

  // <td ... data-date="2025-06-08" id="contribution-day-component-0-0" ... data-level="0" ...>
  const dayById = new Map();
  const tdRe = /data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-[\d-]+)"/g;
  for (let m; (m = tdRe.exec(html)); ) {
    dayById.set(m[2], { date: m[1], count: 0 });
  }

  // <tool-tip ... for="contribution-day-component-0-0" ...>No contributions on June 8th.</tool-tip>
  const tipRe = /<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>(?:\s*)([^<]*)/g;
  for (let m; (m = tipRe.exec(html)); ) {
    const day = dayById.get(m[1]);
    if (!day) continue;
    const countMatch = m[2].match(/^([\d,]+)\s+contribution/);
    if (countMatch) {
      day.count = parseInt(countMatch[1].replace(/,/g, ''), 10);
    }
  }

  const days = Array.from(dayById.values()).sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300) {
    throw new Error(`Parsed only ${days.length} days — page markup may have changed`);
  }

  const total = days.reduce((sum, d) => sum + d.count, 0);
  writeOutput(days, total, 'public-page');
}

async function main() {
  const token = process.env.GITHUB_TOKEN;

  if (token && token !== 'your_github_token_here') {
    try {
      await fetchViaGraphQL(token);
      return;
    } catch (err) {
      console.warn(`GraphQL fetch failed (${err.message}) — falling back to public page`);
    }
  }

  try {
    await fetchViaPublicPage();
  } catch (err) {
    if (fs.existsSync(OUTPUT)) {
      console.warn(`Public page fetch failed (${err.message}) — keeping existing github-activity.json`);
      return;
    }
    console.warn(`Public page fetch failed (${err.message}) and no cached data — writing empty placeholder`);
    writeOutput([], 0, 'placeholder');
  }
}

main();
