#!/usr/bin/env node

/**
 * Fetches real GitHub contribution calendar data via GraphQL API
 * and writes it to src/data/github-activity.json for static builds.
 *
 * Usage: GITHUB_TOKEN=ghp_xxx node scripts/fetch-github-activity.js
 */

const fs = require('fs');
const path = require('path');

const USERNAME = 'EdwinjJ1';
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'github-activity.json');

async function fetchContributions() {
  const token = process.env.GITHUB_TOKEN;
  if (!token || token === 'your_github_token_here') {
    console.error('Error: GITHUB_TOKEN environment variable required');
    process.exit(1);
  }

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
  const allDays = calendar.weeks.flatMap(w => w.contributionDays);

  const data = {
    totalContributions: calendar.totalContributions,
    days: allDays.map(d => ({ date: d.date, count: d.contributionCount })),
    fetchedAt: new Date().toISOString(),
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  console.log(`Wrote ${allDays.length} days, ${calendar.totalContributions} total contributions to ${OUTPUT}`);
}

fetchContributions().catch(err => {
  console.error('Failed to fetch GitHub activity:', err.message);
  process.exit(1);
});
