// Generate news data JSON for personal website
// Usage: node generate-news-data.js [date]

const fs = require('fs');
const path = require('path');

const date = process.argv[2] || new Date().toISOString().split('T')[0];
const newsDir = path.join(__dirname, '..', 'src', 'data', 'news', date);

const newsData = {
  date,
  lastUpdated: new Date().toISOString(),
  categories: {
    ai: [],
    research: [],
    industry: [],
    global: []
  }
};

// Parse HTML files and extract news items
function parseHtmlFile(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Simple extraction - in production you'd use proper HTML parsing
    const items = [];
    
    // Extract title from <h3> tags
    const titleMatches = content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gs);
    const summaryMatches = content.matchAll(/<p[^>]*class="summary"[^>]*>(.*?)<\/p>/gs);
    
    const titles = [...content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gs)];
    const summaries = [...content.matchAll(/<p[^>]*>(.*?)<\/p>/gs)];
    
    return items;
  } catch (e) {
    return [];
  }
}

// Scan news directories
const categories = ['ai-news', 'arxiv-papers', 'industry-news', 'global-news'];
const categoryMap = {
  'ai-news': 'ai',
  'arxiv-papers': 'research', 
  'industry-news': 'industry',
  'global-news': 'global'
};

categories.forEach(cat => {
  const catDir = path.join(newsDir, cat);
  if (fs.existsSync(catDir)) {
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
    console.log(`Found ${files.length} ${cat} files for ${date}`);
  }
});

// Write output
const outputPath = path.join(__dirname, '..', 'src', 'data', 'news-data.json');
fs.writeFileSync(outputPath, JSON.stringify(newsData, null, 2));
console.log(`Generated news data at ${outputPath}`);
