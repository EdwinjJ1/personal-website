#!/usr/bin/env node
// Add news item to news-data.json
// Usage: node add-news.js '{"title":"...", "summary":"...", "tag":"PRODUCT", "source":"...", "sourceUrl":"...", "category":"ai"}'

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'src', 'data', 'news-data.json');

if (process.argv.length < 3) {
  console.error('Usage: node add-news.js \'{"title":"...", "summary":"...", ...}\'');
  process.exit(1);
}

try {
  const newItem = JSON.parse(process.argv[2]);
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  
  // Auto-generate ID and timestamp
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].slice(0, 5);
  
  newItem.id = newItem.id || `${newItem.category}-${Date.now()}`;
  newItem.date = newItem.date || date;
  newItem.time = newItem.time || time;
  
  // Validate required fields
  const required = ['title', 'summary', 'tag', 'source', 'sourceUrl', 'category'];
  for (const field of required) {
    if (!newItem[field]) {
      console.error(`Missing required field: ${field}`);
      process.exit(1);
    }
  }
  
  // Validate tag
  const validTags = ['BREAKING', 'PRODUCT', 'RESEARCH', 'POLICY'];
  if (!validTags.includes(newItem.tag)) {
    console.error(`Invalid tag: ${newItem.tag}. Must be one of: ${validTags.join(', ')}`);
    process.exit(1);
  }
  
  // Validate category
  const validCategories = ['ai', 'research', 'industry', 'global'];
  if (!validCategories.includes(newItem.category)) {
    console.error(`Invalid category: ${newItem.category}. Must be one of: ${validCategories.join(', ')}`);
    process.exit(1);
  }
  
  // Check for duplicates
  const exists = data.news.find(n => n.title === newItem.title);
  if (exists) {
    console.log('Item already exists, skipping');
    process.exit(0);
  }
  
  // Add to beginning of array
  data.news.unshift(newItem);
  
  // Update lastUpdated
  data.lastUpdated = now.toISOString();
  
  // Add date to availableDates if not exists
  const dateExists = data.availableDates.find(d => d.value === date);
  if (!dateExists) {
    const label = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    data.availableDates.unshift({ value: date, label });
  }
  
  // Write back
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log(`Added: ${newItem.title}`);
  
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
