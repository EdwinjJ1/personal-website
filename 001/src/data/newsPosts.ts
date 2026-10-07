export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  sourceUrl: string;
  date: string;
  category: 'ai' | 'research' | 'industry' | 'global';
  tags: string[];
  featured: boolean;
  breaking: boolean;
}

export const newsPosts: NewsPost[] = [
  // AI News - Feb 25, 2026
  {
    id: 1,
    slug: 'anthropic-raises-30b-series-g',
    title: 'Anthropic Raises $30 Billion in Series G at $380 Billion Valuation',
    excerpt: 'Anthropic closed Series G funding led by GIC and Coatue, valuing the company at $380 billion. Run-rate revenue is $14 billion, growing 10x annually for three consecutive years.',
    content: `Anthropic has raised $30 billion in Series G funding led by GIC and Coatue, valuing the company at $380 billion post-money.

## Key Highlights

- **Run-rate revenue**: $14 billion
- **Growth**: 10x annually for three consecutive years
- **Market position**: Leader in enterprise AI and coding
- **Use of funds**: Frontier research, product development, and infrastructure expansion

## What This Means

This massive funding round solidifies Anthropic's position as one of the most valuable AI companies globally. The $380 billion valuation puts them in rarefied air, demonstrating the continued investor appetite for frontier AI companies with proven revenue traction.

The $14 billion run-rate revenue is particularly impressive, showing that enterprise adoption of Claude is accelerating rapidly. The fact that this has grown 10x annually for three years straight indicates strong product-market fit.

### Competitive Landscape

With this funding, Anthropic is well-positioned to compete with OpenAI, Google DeepMind, and other frontier labs. The capital will be crucial for:
- Training next-generation models
- Building data center infrastructure
- Expanding enterprise sales and partnerships
- Advancing AI safety research`,
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    date: '2026-02-25',
    category: 'ai',
    tags: ['Anthropic', 'Funding', 'Claude', 'Enterprise AI'],
    featured: true,
    breaking: true
  },
  {
    id: 2,
    slug: 'amd-meta-100b-chip-deal',
    title: 'AMD Forges $100 Billion Deal with Meta for AI Chips',
    excerpt: 'Meta has signed a multi-year agreement to buy six gigawatts worth of AMD processors for AI data centers. The deal could see Meta owning 10% of AMD stock.',
    content: `Meta has signed a massive multi-year agreement with AMD worth $100 billion for AI chips.

## Deal Details

- **Value**: $100 billion
- **Capacity**: 6 gigawatts of AMD processors
- **Potential equity**: Meta could own up to 10% of AMD stock
- **Follows**: Similar AMD-OpenAI agreement

## Strategic Implications

This deal represents a major win for AMD in the AI chip market, which has been dominated by NVIDIA. Meta's decision to diversify its chip suppliers shows:

1. **Supply chain resilience**: Reducing dependence on a single vendor
2. **Cost optimization**: AMD may offer competitive pricing
3. **Strategic partnership**: Potential for deeper collaboration

### For Meta

- Secures long-term compute capacity for AI training and inference
- Reduces NVIDIA dependency after buying millions of their chips last week
- Potential equity stake aligns AMD's success with Meta's interests

### For AMD

- Massive revenue visibility for years to come
- Validates MI300 and future AI accelerator lineup
- Competes directly with NVIDIA's dominant position`,
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com/ai-artificial-intelligence',
    date: '2026-02-25',
    category: 'ai',
    tags: ['AMD', 'Meta', 'AI Chips', 'Hardware'],
    featured: true,
    breaking: true
  },
  {
    id: 3,
    slug: 'openai-hires-chief-people-officer',
    title: 'OpenAI Appoints New Chief People Officer',
    excerpt: 'Arvind KC joins from Roblox as OpenAI\'s new chief people officer. He previously held senior roles at Google, Palantir, and Meta.',
    content: `OpenAI has appointed Arvind KC as its new Chief People Officer, filling a position that had been vacant since August 2025.

## Background

- **Previous role**: Chief People and Systems Officer at Roblox
- **Past experience**: Senior roles at Google, Palantir, and Meta
- **Replaces**: Julia Villagra (departed August 2025 after less than 6 months)

## What This Signals

This hire comes at a critical time for OpenAI as they:

1. **Scale rapidly**: Growing workforce to match ambition
2. **Navigate culture**: Balancing research mission with commercial goals
3. **Compete for talent**: AI talent war is intense

### The Challenge

OpenAI has faced scrutiny over workplace culture and the departure of several key safety researchers. KC's experience at fast-growing tech companies will be valuable in:

- Building scalable HR systems
- Managing rapid growth
- Attracting and retaining top AI talent
- Navigating complex organizational dynamics`,
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com/ai-artificial-intelligence',
    date: '2026-02-25',
    category: 'ai',
    tags: ['OpenAI', 'Hiring', 'Leadership'],
    featured: false,
    breaking: true
  },
  {
    id: 4,
    slug: 'ggml-llamacpp-join-huggingface',
    title: 'GGML & llama.cpp Join Hugging Face',
    excerpt: 'Major consolidation for local AI ecosystem. Ensures long-term progress of open-source local AI development.',
    content: `GGML and llama.cpp have joined Hugging Face in a major consolidation for the local AI ecosystem.

## What Happened

- **GGML**: The foundational library for running LLMs on consumer hardware
- **llama.cpp**: The most popular C++ port of LLaMA for efficient inference
- **Combined**: Both projects now under Hugging Face umbrella

## Why This Matters

### For Local AI

This ensures the long-term sustainability of projects that enable:

1. **Running LLMs locally**: Without cloud dependency
2. **Privacy-preserving AI**: Data stays on device
3. **Cost-effective inference**: No API fees
4. **Offline capability**: Works without internet

### For Open Source

Hugging Face's stewardship provides:

- Sustainable funding and resources
- Integration with the HF ecosystem
- Continued open-source development
- Community governance

### Technical Impact

The combination of GGML's quantization techniques with llama.cpp's efficient implementation has been transformative for local AI. This consolidation ensures continued innovation in:

- Model compression
- Hardware optimization
- Cross-platform support
- New quantization formats`,
    source: 'Hugging Face',
    sourceUrl: 'https://huggingface.co/blog/ggml-joins-hf',
    date: '2026-02-25',
    category: 'ai',
    tags: ['Hugging Face', 'GGML', 'llama.cpp', 'Open Source', 'Local AI'],
    featured: true,
    breaking: true
  },
  {
    id: 5,
    slug: 'claude-opus-4-6-released',
    title: 'Claude Opus 4.6 Released - Industry-Leading Performance',
    excerpt: 'Anthropic\'s smartest model upgraded. Industry-leading in agentic coding, computer use, tool use, search, and finance benchmarks.',
    content: `Anthropic has released Claude Opus 4.6, an upgrade to their flagship model.

## Performance Highlights

Opus 4.6 leads across multiple benchmarks:

- **Agentic coding**: #1 position
- **Computer use**: #1 position  
- **Tool use**: #1 position
- **Search tasks**: #1 position
- **Finance applications**: #1 position

## Key Improvements

### Enhanced Reasoning

- Better multi-step problem solving
- Improved instruction following
- More reliable tool calling

### Agentic Capabilities

- Superior at autonomous task completion
- Better at planning and execution
- Enhanced error recovery

### Enterprise Features

- Stronger performance on business tasks
- Better at complex analysis
- Improved code generation quality

## Availability

Claude Opus 4.6 is available through:
- Anthropic API
- Claude web interface
- Enterprise deployments`,
    source: 'Anthropic',
    sourceUrl: 'https://www.anthropic.com/news',
    date: '2026-02-25',
    category: 'ai',
    tags: ['Claude', 'Anthropic', 'LLM', 'Release'],
    featured: false,
    breaking: false
  },
  {
    id: 6,
    slug: 'gemini-3-1-pro-released',
    title: 'Google Gemini 3.1 Pro Rolling Out',
    excerpt: 'New model with advanced reasoning capabilities now available in Gemini app and NotebookLM.',
    content: `Google has released Gemini 3.1 Pro, their latest model with enhanced reasoning capabilities.

## What's New

Gemini 3.1 Pro is designed for tasks where a simple answer isn't enough:

- **Advanced reasoning**: Complex problem solving
- **Visual explanations**: Better at explaining concepts
- **Data synthesis**: Combining information from multiple sources
- **Creative projects**: Enhanced creative capabilities

## Availability

- Gemini app
- Google NotebookLM
- Google Cloud Vertex AI (coming soon)

## Competitive Position

Gemini 3.1 Pro competes directly with:
- Claude Opus 4.6
- GPT-4o
- Other frontier models

The focus on "reasoning" suggests improvements in multi-step tasks and complex analysis.`,
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com/ai-artificial-intelligence',
    date: '2026-02-25',
    category: 'ai',
    tags: ['Google', 'Gemini', 'LLM', 'Release'],
    featured: false,
    breaking: false
  },
  // Arxiv Research
  {
    id: 7,
    slug: 'resyn-synthetic-reasoning-environments',
    title: 'ReSyn: Scaling Synthetic Environments for Reasoning Models',
    excerpt: 'A Qwen2.5-7B trained on ReSyn data achieves 27% improvement on the BBEH benchmark. Generates diverse reasoning environments with verifiers.',
    content: `Researchers have introduced ReSyn, a pipeline that generates diverse reasoning environments equipped with instance generators and verifiers.

## Key Results

- **27% improvement** on BBEH benchmark
- Uses Qwen2.5-7B-Instruct as base model
- Trained with reinforcement learning on synthetic data

## How It Works

ReSyn generates:
1. **Reasoning environments**: Constraint satisfaction, algorithmic puzzles, spatial reasoning
2. **Instance generators**: Create problem instances
3. **Verifiers**: Check solution correctness

## Why It Matters

This approach addresses a key bottleneck in AI research: the need for large amounts of training data with ground truth labels. By generating synthetic environments with verifiers, researchers can:

- Scale training without human annotation
- Create diverse problem types
- Ensure correctness through verification

### Implications

- Could accelerate reasoning model development
- Reduces dependency on human-labeled data
- Enables self-improving AI systems`,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2602.20117',
    date: '2026-02-25',
    category: 'research',
    tags: ['Research', 'Reasoning', 'RL', 'Synthetic Data'],
    featured: true,
    breaking: false
  },
  {
    id: 8,
    slug: 'rspg-mean-field-games',
    title: 'RSPG: First History-Aware Method for Partially Observable Mean Field Games',
    excerpt: 'Oxford team achieves state-of-the-art performance with 10x faster convergence. Releases MFAX framework for MFG research.',
    content: `Oxford researchers have introduced Recurrent Structural Policy Gradient (RSPG), the first history-aware hybrid structural method for partially observable mean field games.

## Key Contributions

- **10x faster convergence** than previous methods
- **State-of-the-art performance**
- **MFAX framework**: JAX-based open-source implementation

## The Problem

Mean Field Games model large populations of interacting agents. At scale, population dynamics become deterministic, but partially observable settings have been challenging.

## The Solution

RSPG combines:
- Monte Carlo rollouts for common noise
- Exact estimation conditioned on samples
- Recurrent architecture for history awareness

## Applications

- Economics and market modeling
- Multi-agent AI systems
- Population dynamics simulation
- Resource allocation

### GitHub

Code available at: github.com/CWibault/mfax`,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2602.20141',
    date: '2026-02-25',
    category: 'research',
    tags: ['Research', 'RL', 'Multi-Agent', 'Oxford'],
    featured: true,
    breaking: false
  },
  {
    id: 9,
    slug: 'behavior-learning-iclr-2026',
    title: 'Behavior Learning: Learning Interpretable Optimization Structures from Data',
    excerpt: 'ICLR 2026 paper introduces framework for learning interpretable utility functions with theoretical guarantees.',
    content: `Researchers have introduced Behavior Learning (BL), a novel machine learning framework that learns interpretable optimization structures from data.

## Key Features

- **Accepted at ICLR 2026**
- **Interpretable**: Learn utility functions in symbolic form
- **Identifiable**: Smooth variant (IBL) guarantees identifiability
- **Universal approximation**: Proven theoretical property

## How It Works

BL parameterizes:
- Compositional utility functions
- Built from interpretable modular blocks
- Induces data distribution for prediction

## Applications

- Scientific domains involving optimization
- Economics and decision theory
- Robotics and control
- Any domain where interpretability matters

### Installation

\`\`\`bash
pip install blnetwork
\`\`\`

GitHub: github.com/MoonYLiang/Behavior-Learning`,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2602.20152',
    date: '2026-02-25',
    category: 'research',
    tags: ['Research', 'ICLR 2026', 'Interpretability', 'ML'],
    featured: false,
    breaking: false
  },
  // Industry News
  {
    id: 10,
    slug: 'software-stocks-ai-selloff',
    title: 'Software Stocks Hit by AI-Fueled Selloff',
    excerpt: 'US software and private capital shares experience fresh wave of selling as investors rotate from AI-exposed stocks to asset-heavy industries.',
    content: `US software and private capital shares have been hit with a fresh wave of selling as investors seek shelter from the AI rout.

## What's Happening

- **Software stocks**: Sharp decline in valuations
- **Private capital**: Also affected by rotation
- **Destination**: Asset-heavy industries

## Why This Matters

### Market Signals

1. **AI hype cooling**: Investors questioning valuations
2. **Profit taking**: Locking in gains from AI rally
3. **Rotation**: Moving to "safer" investments

### For Startups

- May face more scrutiny in fundraising
- Need clearer path to profitability
- AI differentiation alone may not be enough

### For Enterprise Software

- Companies without clear AI strategy face pressure
- Legacy software valuations under review
- Margin pressure from AI competition

## Outlook

This correction could be healthy long-term, weeding out companies without sustainable business models.`,
    source: 'Financial Times',
    sourceUrl: 'https://www.ft.com/technology',
    date: '2026-02-25',
    category: 'industry',
    tags: ['Markets', 'Software', 'Investing', 'SaaS'],
    featured: true,
    breaking: false
  },
  {
    id: 11,
    slug: 'reddit-fined-20m-uk',
    title: 'Reddit Fined $20M for Children\'s Data Violations',
    excerpt: 'UK\'s Information Commissioner\'s Office fined Reddit for inadequate age verification and failure to assess risks to children.',
    content: `The UK's Information Commissioner's Office (ICO) has fined Reddit £14.47 million (~$19.5 million) for children's data violations.

## The Fine

- **Amount**: £14.47 million (~$19.5 million)
- **Reason**: Inadequate age verification
- **Period**: Before January 2025

## What Went Wrong

Reddit failed to:
1. Implement robust age verification
2. Assess risks to children
3. Protect children's data appropriately

## Implications

### For Reddit

- Financial penalty
- Reputational damage
- Must implement changes

### For Industry

- Sets precedent for age verification enforcement
- Other social platforms should take note
- UK taking strong stance on children's safety

### For Users

- Potential changes to platform access
- May require age verification
- Could affect user experience

## Comparison

This fine is significantly higher than Imgur's recent £247,590 penalty for similar violations.`,
    source: 'The Verge',
    sourceUrl: 'https://www.theverge.com/tech',
    date: '2026-02-25',
    category: 'industry',
    tags: ['Reddit', 'Privacy', 'Regulation', 'UK'],
    featured: false,
    breaking: false
  },
  // Global Events
  {
    id: 12,
    slug: 'canada-summons-openai',
    title: 'Canada Summons OpenAI Over Shooting Incident',
    excerpt: 'Canadian officials seek answers after Tumbler Ridge shooter\'s ChatGPT account was banned months before the attack.',
    content: `Canadian officials have summoned OpenAI senior staff for questioning in relation to the Tumbler Ridge shooting incident.

## What Happened

- **Incident**: Shooting in Tumbler Ridge, Canada
- **AI connection**: Suspect's ChatGPT account was banned months before
- **Investigation**: Officials seeking "better understanding"

## Key Questions

1. What did the AI system detect?
2. Were authorities notified?
3. Could the incident have been prevented?

## Implications for AI

### Accountability

This sets a precedent for AI companies' responsibility:
- Detecting potential threats
- Reporting to authorities
- Balancing privacy vs. safety

### Policy Impact

- May influence AI regulation globally
- Questions about AI's role in public safety
- Debate over monitoring vs. privacy

### For AI Companies

- Need clear policies on threat detection
- May require reporting mechanisms
- Liability questions emerging

## What's Next

- OpenAI cooperating with investigation
- Results may inform future policy
- Industry watching closely`,
    source: 'BBC',
    sourceUrl: 'https://www.bbc.com/news/world',
    date: '2026-02-25',
    category: 'global',
    tags: ['OpenAI', 'Canada', 'Policy', 'Safety'],
    featured: true,
    breaking: true
  },
  {
    id: 13,
    slug: 'trump-worldwide-tariff',
    title: 'Trump\'s 10% Worldwide Tariff Goes Into Effect',
    excerpt: 'The universal tariff replaces previous targeted measures, with vows of retaliation against countries that "play games."',
    content: `Donald Trump's new 10% worldwide tariff has officially gone into effect, marking a significant shift in US trade policy.

## The Tariff

- **Rate**: 10% on all imports
- **Scope**: Worldwide, universal
- **Replaces**: Previous targeted tariffs

## Impact on Tech

### Supply Chains

- Hardware manufacturing costs increase
- Semiconductor supply chains affected
- Cloud infrastructure costs may rise

### For Companies

- Margin pressure on hardware
- May accelerate US manufacturing
- Price increases for consumers

### For Startups

- Higher costs for hardware startups
- May need to adjust pricing
- Supply chain diversification important

## Reactions

- Trading partners reviewing options
- Some countries may retaliate
- Markets reacting to uncertainty

## Outlook

This represents a major shift toward protectionism. Tech companies with global supply chains will need to adapt.`,
    source: 'SMH',
    sourceUrl: 'https://www.smh.com.au/world',
    date: '2026-02-25',
    category: 'global',
    tags: ['Trade', 'Tariffs', 'Policy', 'Economy'],
    featured: false,
    breaking: true
  }
];

// Helper functions
export function getAllNews(): NewsPost[] {
  return newsPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsByCategory(category: NewsPost['category']): NewsPost[] {
  return newsPosts
    .filter(post => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find(post => post.slug === slug);
}

export function getBreakingNews(): NewsPost[] {
  return newsPosts
    .filter(post => post.breaking)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedNews(): NewsPost[] {
  return newsPosts
    .filter(post => post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecentNews(limit: number = 10): NewsPost[] {
  return getAllNews().slice(0, limit);
}

export function getNewsByDate(date: string): NewsPost[] {
  return newsPosts
    .filter(post => post.date === date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
