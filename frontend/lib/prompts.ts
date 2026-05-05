export type PromptAccess = "free" | "premium";

export type PromptComment = {
  id: number;
  author: string;
  message: string;
  createdLabel: string;
};

export type Prompt = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  sales: number;
  creator: string;
  access: PromptAccess;
  excerpt: string;
  likes: number;
  comments: PromptComment[];
};

const PROMPT_LIKES_STORAGE_KEY = "promptx.promptLikes";
const PROMPT_SAVES_STORAGE_KEY = "promptx.savedPrompts";

type StorageScopedUser = {
  id?: string;
  email?: string;
};

export const prompts: Prompt[] = [
  {
    id: 1,
    slug: "seo-blog-post-generator",
    title: "SEO Blog Post Generator",
    description: "Generate SEO-optimized blog posts with engaging content.",
    category: "Writing",
    rating: 4.8,
    sales: 1234,
    creator: "Sarah Johnson",
    access: "free",
    excerpt:
      "Build article outlines, search-intent hooks, and keyword-friendly intros in one pass.",
    likes: 182,
    comments: [
      {
        id: 1,
        author: "Maya",
        message: "Clean structure and very usable for long-form article drafts.",
        createdLabel: "2h ago",
      },
      {
        id: 2,
        author: "Dev",
        message: "The hook and outline instructions save a lot of editing time.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 2,
    slug: "logo-design-assistant",
    title: "Logo Design Assistant",
    description: "Create unique logo concepts with detailed art direction.",
    category: "Design",
    rating: 4.9,
    sales: 856,
    creator: "Mike Chen",
    access: "free",
    excerpt:
      "Turn a brand brief into multiple logo directions, moodboards, and typography ideas.",
    likes: 143,
    comments: [
      {
        id: 3,
        author: "Ariana",
        message: "Really helpful for getting out of the blank-canvas phase.",
        createdLabel: "5h ago",
      },
    ],
  },
  {
    id: 3,
    slug: "python-code-optimizer",
    title: "Python Code Optimizer",
    description: "Refactor Python code for readability, speed, and maintainability.",
    category: "Coding",
    rating: 4.7,
    sales: 632,
    creator: "Alex Kumar",
    access: "free",
    excerpt:
      "Spot bottlenecks, simplify logic, and propose cleaner implementations with test notes.",
    likes: 126,
    comments: [
      {
        id: 4,
        author: "Soham",
        message: "Nice prompt when you want refactor suggestions with reasoning.",
        createdLabel: "Today",
      },
    ],
  },
  {
    id: 4,
    slug: "social-media-caption-writer",
    title: "Social Media Caption Writer",
    description: "Craft polished captions for Instagram, LinkedIn, and X.",
    category: "Marketing",
    rating: 4.6,
    sales: 2145,
    creator: "Emma Davis",
    access: "free",
    excerpt:
      "Generate platform-aware captions, CTA options, and tone variations for quick publishing.",
    likes: 211,
    comments: [
      {
        id: 5,
        author: "Neha",
        message: "Good variety of CTA tones without sounding repetitive.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 5,
    slug: "email-marketing-template",
    title: "Email Marketing Template",
    description: "Draft email campaigns with stronger hooks and cleaner structure.",
    category: "Marketing",
    rating: 4.8,
    sales: 987,
    creator: "David Lee",
    access: "free",
    excerpt:
      "Create welcome, nurture, and launch emails with consistent messaging and subject lines.",
    likes: 167,
    comments: [
      {
        id: 6,
        author: "Chris",
        message: "The email flow logic is what makes this prompt useful.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 6,
    slug: "story-plot-generator",
    title: "Story Plot Generator",
    description: "Generate plot arcs, twists, and stronger character setups.",
    category: "Writing",
    rating: 4.5,
    sales: 445,
    creator: "Lisa Park",
    access: "free",
    excerpt:
      "Outline story beats, emotional turns, and character motivations without losing momentum.",
    likes: 98,
    comments: [
      {
        id: 7,
        author: "Riya",
        message: "Helpful for escaping plot holes when drafting fiction.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 7,
    slug: "react-component-builder",
    title: "React Component Builder",
    description: "Design polished React UI components with implementation guidance.",
    category: "Coding",
    rating: 5,
    sales: 128,
    creator: "Priya Nair",
    access: "premium",
    excerpt:
      "Reserved for the top 1% premium collection with deeper implementation and QA prompts.",
    likes: 59,
    comments: [
      {
        id: 8,
        author: "Ishan",
        message: "Very strong for component scaffolding and edge-case thinking.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 8,
    slug: "linkedin-thought-leadership-writer",
    title: "LinkedIn Thought Leadership Writer",
    description: "Turn rough ideas into polished LinkedIn posts with strong hooks and authority.",
    category: "Marketing",
    rating: 4.7,
    sales: 764,
    creator: "Anika Roy",
    access: "free",
    excerpt:
      "Shape founder notes, industry takes, and carousel copy into posts that feel credible and conversational.",
    likes: 132,
    comments: [
      {
        id: 9,
        author: "Rohan",
        message: "Strong hook framework for professional posts.",
        createdLabel: "6h ago",
      },
    ],
  },
  {
    id: 9,
    slug: "product-launch-announcement-kit",
    title: "Product Launch Announcement Kit",
    description: "Write launch messaging for product drops, changelogs, and waitlist reveals.",
    category: "Marketing",
    rating: 4.8,
    sales: 1192,
    creator: "Jules Carter",
    access: "free",
    excerpt:
      "Generate headlines, launch emails, social posts, and press-style summaries in a single workflow.",
    likes: 188,
    comments: [
      {
        id: 10,
        author: "Mina",
        message: "Useful when a release needs copy fast across channels.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 10,
    slug: "brand-voice-calibrator",
    title: "Brand Voice Calibrator",
    description: "Define and reuse a brand voice that stays consistent across campaigns.",
    category: "Writing",
    rating: 4.6,
    sales: 553,
    creator: "Noah Bennett",
    access: "free",
    excerpt:
      "Translate examples and tone references into a reusable voice system with dos, don'ts, and sample rewrites.",
    likes: 109,
    comments: [
      {
        id: 11,
        author: "Lina",
        message: "Helpful for making style guidelines more concrete.",
        createdLabel: "Today",
      },
    ],
  },
  {
    id: 11,
    slug: "landing-page-copy-doctor",
    title: "Landing Page Copy Doctor",
    description: "Improve landing page headlines, sections, CTAs, and conversion clarity.",
    category: "Writing",
    rating: 4.9,
    sales: 1451,
    creator: "Karan Mehta",
    access: "free",
    excerpt:
      "Diagnose weak messaging, sharpen value propositions, and rebuild hero-to-CTA flow for higher clarity.",
    likes: 214,
    comments: [
      {
        id: 12,
        author: "Tia",
        message: "The headline rewrites are especially strong.",
        createdLabel: "3h ago",
      },
    ],
  },
  {
    id: 12,
    slug: "newsletter-issue-builder",
    title: "Newsletter Issue Builder",
    description: "Draft editorial newsletters with sections, transitions, and sharper takeaways.",
    category: "Writing",
    rating: 4.5,
    sales: 482,
    creator: "Ava Smith",
    access: "free",
    excerpt:
      "Turn scattered links and notes into a clean newsletter issue with a strong opening and curated flow.",
    likes: 87,
    comments: [
      {
        id: 13,
        author: "Pooja",
        message: "Nice for weekly curation emails.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 13,
    slug: "motion-graphic-brief-generator",
    title: "Motion Graphic Brief Generator",
    description: "Create animation briefs with scene direction, pacing, and visual notes.",
    category: "Design",
    rating: 4.8,
    sales: 673,
    creator: "Nikhil Bose",
    access: "free",
    excerpt:
      "Map a rough concept into shots, transitions, timing cues, and a cohesive art direction for motion teams.",
    likes: 141,
    comments: [
      {
        id: 14,
        author: "Aya",
        message: "Great for speeding up first-pass motion briefs.",
        createdLabel: "5h ago",
      },
    ],
  },
  {
    id: 14,
    slug: "ux-microcopy-workshop",
    title: "UX Microcopy Workshop",
    description: "Write clearer product UI text for forms, toasts, empty states, and onboarding.",
    category: "Design",
    rating: 4.7,
    sales: 728,
    creator: "Maria Lopez",
    access: "free",
    excerpt:
      "Refine product messaging with short, human-friendly alternatives that keep flows understandable.",
    likes: 134,
    comments: [
      {
        id: 15,
        author: "Devika",
        message: "Useful for tightening product wording quickly.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 15,
    slug: "dashboard-ui-critic",
    title: "Dashboard UI Critic",
    description: "Review analytics dashboards for hierarchy, spacing, and scanability.",
    category: "Design",
    rating: 4.6,
    sales: 611,
    creator: "Jordan Pike",
    access: "free",
    excerpt:
      "Spot clutter, suggest cleaner modules, and improve the flow from overview metrics to deeper insight blocks.",
    likes: 118,
    comments: [
      {
        id: 16,
        author: "Sana",
        message: "Good at catching hierarchy problems in admin screens.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 16,
    slug: "poster-concept-machine",
    title: "Poster Concept Machine",
    description: "Generate bold poster directions with layout systems, type, and mood cues.",
    category: "Design",
    rating: 4.9,
    sales: 803,
    creator: "Kai Morgan",
    access: "free",
    excerpt:
      "Push past safe visual ideas and create memorable poster concepts with compositional clarity.",
    likes: 193,
    comments: [
      {
        id: 17,
        author: "Yash",
        message: "Very fun for exploring multiple visual directions.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 17,
    slug: "figma-component-namer",
    title: "Figma Component Namer",
    description: "Create cleaner naming systems for components, variants, and design tokens.",
    category: "Design",
    rating: 4.4,
    sales: 334,
    creator: "Helen Park",
    access: "free",
    excerpt:
      "Turn messy component sets into a naming convention that scales across teams and libraries.",
    likes: 72,
    comments: [
      {
        id: 18,
        author: "Neil",
        message: "Practical prompt for tidying a design system.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 18,
    slug: "typescript-bug-hunter",
    title: "TypeScript Bug Hunter",
    description: "Find type issues, risky assumptions, and brittle code paths in TS projects.",
    category: "Coding",
    rating: 4.8,
    sales: 912,
    creator: "Farah Khan",
    access: "free",
    excerpt:
      "Audit a file or module for weak typing, runtime risk, and safer refactor options with examples.",
    likes: 176,
    comments: [
      {
        id: 19,
        author: "Ira",
        message: "Useful when strict mode exposes a mess.",
        createdLabel: "7h ago",
      },
    ],
  },
  {
    id: 19,
    slug: "sql-query-optimizer",
    title: "SQL Query Optimizer",
    description: "Refine SQL queries for performance, readability, and better indexing choices.",
    category: "Coding",
    rating: 4.7,
    sales: 689,
    creator: "Owen Price",
    access: "free",
    excerpt:
      "Break down slow queries, identify joins or scans, and propose clearer or faster alternatives.",
    likes: 149,
    comments: [
      {
        id: 20,
        author: "Gita",
        message: "Good prompt for debugging ugly reporting queries.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 20,
    slug: "api-error-debugger",
    title: "API Error Debugger",
    description: "Diagnose backend request failures with hypotheses, checks, and likely fixes.",
    category: "Coding",
    rating: 4.9,
    sales: 1056,
    creator: "Ravi Malhotra",
    access: "free",
    excerpt:
      "Walk through logs, payloads, and edge cases to find the most probable cause of API failures.",
    likes: 205,
    comments: [
      {
        id: 21,
        author: "Mert",
        message: "Helps structure debugging instead of guessing.",
        createdLabel: "8h ago",
      },
    ],
  },
  {
    id: 21,
    slug: "nodejs-architecture-reviewer",
    title: "Node.js Architecture Reviewer",
    description: "Review backend structure for scalability, layering, and maintainability.",
    category: "Coding",
    rating: 4.6,
    sales: 544,
    creator: "Elena Cruz",
    access: "free",
    excerpt:
      "Surface coupling, module boundaries, and refactor opportunities in an Express or Node service.",
    likes: 116,
    comments: [
      {
        id: 22,
        author: "Sam",
        message: "Strong for discussing service boundaries.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 22,
    slug: "react-state-simplifier",
    title: "React State Simplifier",
    description: "Reduce tangled component state and make UI logic easier to reason about.",
    category: "Coding",
    rating: 4.8,
    sales: 741,
    creator: "Diya Kapoor",
    access: "free",
    excerpt:
      "Find redundant state, derive simpler flows, and suggest cleaner event-driven patterns for React.",
    likes: 164,
    comments: [
      {
        id: 23,
        author: "Harsh",
        message: "Nice when a component gets too many booleans.",
        createdLabel: "4h ago",
      },
    ],
  },
  {
    id: 23,
    slug: "test-case-generator-pro",
    title: "Test Case Generator Pro",
    description: "Generate practical unit, integration, and edge-case test scenarios from code.",
    category: "Coding",
    rating: 4.7,
    sales: 801,
    creator: "Ben Ortiz",
    access: "free",
    excerpt:
      "Turn business rules and source code into targeted test ideas with missing-edge-case coverage.",
    likes: 153,
    comments: [
      {
        id: 24,
        author: "Amit",
        message: "Great for widening test coverage fast.",
        createdLabel: "5d ago",
      },
    ],
  },
  {
    id: 24,
    slug: "cold-email-angle-finder",
    title: "Cold Email Angle Finder",
    description: "Generate stronger outreach angles for founders, agencies, and sales teams.",
    category: "Marketing",
    rating: 4.5,
    sales: 463,
    creator: "Zara West",
    access: "free",
    excerpt:
      "Produce hooks, personalization angles, and CTA variants that avoid sounding generic or spammy.",
    likes: 95,
    comments: [
      {
        id: 25,
        author: "Adeel",
        message: "Useful for outbound experiments.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 25,
    slug: "seo-content-brief-builder",
    title: "SEO Content Brief Builder",
    description: "Create SEO content briefs with intent, structure, and coverage recommendations.",
    category: "Marketing",
    rating: 4.8,
    sales: 978,
    creator: "Meera Joshi",
    access: "free",
    excerpt:
      "Build stronger briefs with search intent, outline suggestions, FAQ ideas, and competitive angles.",
    likes: 169,
    comments: [
      {
        id: 26,
        author: "Ken",
        message: "Helpful before handing work to writers.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 26,
    slug: "ad-creative-variant-generator",
    title: "Ad Creative Variant Generator",
    description: "Produce multiple paid ad angles, hooks, and copy variations from one brief.",
    category: "Marketing",
    rating: 4.7,
    sales: 723,
    creator: "Sophia Reed",
    access: "free",
    excerpt:
      "Stretch one campaign concept into many testable ad directions with clearer audience positioning.",
    likes: 146,
    comments: [
      {
        id: 27,
        author: "Rita",
        message: "Very useful for performance creative batches.",
        createdLabel: "6d ago",
      },
    ],
  },
  {
    id: 27,
    slug: "customer-persona-distiller",
    title: "Customer Persona Distiller",
    description: "Summarize messy user research into focused personas and buying motivations.",
    category: "Marketing",
    rating: 4.6,
    sales: 538,
    creator: "Theo Martin",
    access: "free",
    excerpt:
      "Cluster pain points, motivations, and objections into persona snapshots that are easier to act on.",
    likes: 112,
    comments: [
      {
        id: 28,
        author: "Nora",
        message: "Good for condensing a lot of interview notes.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 28,
    slug: "screenplay-scene-expander",
    title: "Screenplay Scene Expander",
    description: "Develop screenplay scenes with subtext, tension, and stronger progression.",
    category: "Writing",
    rating: 4.7,
    sales: 407,
    creator: "Leo Grant",
    access: "free",
    excerpt:
      "Take a short scene idea and expand it into beats, tension shifts, and sharper emotional payoff.",
    likes: 101,
    comments: [
      {
        id: 29,
        author: "Ivy",
        message: "Helps turn rough drafts into fuller scenes.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 29,
    slug: "case-study-storyteller",
    title: "Case Study Storyteller",
    description: "Turn project outcomes into convincing customer case studies with narrative flow.",
    category: "Writing",
    rating: 4.9,
    sales: 852,
    creator: "Rina Shah",
    access: "free",
    excerpt:
      "Frame customer context, actions, and results into a stronger story that still feels concrete.",
    likes: 186,
    comments: [
      {
        id: 30,
        author: "Paul",
        message: "Makes B2B results read less dry.",
        createdLabel: "11h ago",
      },
    ],
  },
  {
    id: 30,
    slug: "podcast-episode-outline-builder",
    title: "Podcast Episode Outline Builder",
    description: "Outline podcast episodes with segments, transitions, and memorable takeaways.",
    category: "Writing",
    rating: 4.4,
    sales: 318,
    creator: "Clara Dean",
    access: "free",
    excerpt:
      "Organize ideas, stories, and talking points into a tighter recording outline with listener payoff.",
    likes: 68,
    comments: [
      {
        id: 31,
        author: "Vik",
        message: "Simple and useful for planning solo episodes.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 31,
    slug: "headline-variation-engine",
    title: "Headline Variation Engine",
    description: "Generate stronger headlines for ads, blogs, landing pages, and product launches.",
    category: "Writing",
    rating: 4.8,
    sales: 990,
    creator: "Grace Lin",
    access: "free",
    excerpt:
      "Explore multiple headline angles with different emotional triggers, clarity levels, and tones.",
    likes: 177,
    comments: [
      {
        id: 32,
        author: "Jai",
        message: "Fast way to get unstuck on hero copy.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 32,
    slug: "book-cover-direction-finder",
    title: "Book Cover Direction Finder",
    description: "Develop book cover directions with typography, symbolism, and market positioning.",
    category: "Design",
    rating: 4.7,
    sales: 566,
    creator: "Natalie Stone",
    access: "free",
    excerpt:
      "Translate a manuscript theme into distinct cover concepts with style cues and commercial fit.",
    likes: 123,
    comments: [
      {
        id: 33,
        author: "Eshan",
        message: "Useful early in the concept stage.",
        createdLabel: "5d ago",
      },
    ],
  },
  {
    id: 33,
    slug: "mobile-app-onboarding-fixer",
    title: "Mobile App Onboarding Fixer",
    description: "Improve onboarding steps, reduce friction, and clarify first-time user value.",
    category: "Design",
    rating: 4.8,
    sales: 677,
    creator: "Olivia Hart",
    access: "free",
    excerpt:
      "Review onboarding screens and rewrite the flow to reduce hesitation and improve clarity at each step.",
    likes: 147,
    comments: [
      {
        id: 34,
        author: "Rey",
        message: "Good at surfacing first-run friction.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 34,
    slug: "design-system-token-helper",
    title: "Design System Token Helper",
    description: "Create better token naming and usage patterns for scalable design systems.",
    category: "Design",
    rating: 4.5,
    sales: 389,
    creator: "Amber Scott",
    access: "free",
    excerpt:
      "Build token groups for spacing, type, color, and states in a way that stays maintainable.",
    likes: 79,
    comments: [
      {
        id: 35,
        author: "Mohan",
        message: "Nice helper for early system cleanup.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 35,
    slug: "python-data-cleanup-assistant",
    title: "Python Data Cleanup Assistant",
    description: "Clean messy datasets with transformation ideas, validation rules, and QA checks.",
    category: "Coding",
    rating: 4.6,
    sales: 512,
    creator: "Sofia Ahmed",
    access: "free",
    excerpt:
      "Suggest preprocessing steps, null handling, and sanity checks for untidy CSV or dataframe workflows.",
    likes: 111,
    comments: [
      {
        id: 36,
        author: "Jen",
        message: "Practical for data prep tasks.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 36,
    slug: "code-review-response-helper",
    title: "Code Review Response Helper",
    description: "Write thoughtful PR responses and resolve feedback with clearer reasoning.",
    category: "Coding",
    rating: 4.7,
    sales: 458,
    creator: "Marcus Lee",
    access: "free",
    excerpt:
      "Turn scattered review comments into a structured response plan with tradeoffs and update notes.",
    likes: 104,
    comments: [
      {
        id: 37,
        author: "Pritam",
        message: "Surprisingly helpful for calmer PR conversations.",
        createdLabel: "8d ago",
      },
    ],
  },
  {
    id: 37,
    slug: "feature-spec-clarifier",
    title: "Feature Spec Clarifier",
    description: "Turn vague product requests into sharper implementation-ready feature specs.",
    category: "Coding",
    rating: 4.9,
    sales: 1024,
    creator: "Hannah Cole",
    access: "free",
    excerpt:
      "Extract assumptions, edge cases, acceptance criteria, and risks before development starts.",
    likes: 216,
    comments: [
      {
        id: 38,
        author: "Dinesh",
        message: "Excellent for turning chaos into a plan.",
        createdLabel: "10h ago",
      },
    ],
  },
  {
    id: 38,
    slug: "conversion-funnel-analyst",
    title: "Conversion Funnel Analyst",
    description: "Diagnose drop-off points and optimize messaging across your signup funnel.",
    category: "Marketing",
    rating: 4.8,
    sales: 864,
    creator: "Arun Gill",
    access: "free",
    excerpt:
      "Map user hesitation across the funnel and suggest experiments in copy, structure, and CTA timing.",
    likes: 171,
    comments: [
      {
        id: 39,
        author: "Mika",
        message: "Good lens for reviewing funnel friction.",
        createdLabel: "12h ago",
      },
    ],
  },
  {
    id: 39,
    slug: "ugc-ad-script-writer",
    title: "UGC Ad Script Writer",
    description: "Write UGC-style ad scripts that sound more human and less overproduced.",
    category: "Marketing",
    rating: 4.6,
    sales: 648,
    creator: "Brook Taylor",
    access: "free",
    excerpt:
      "Create short ad scripts with natural hooks, product framing, and creator-style delivery cues.",
    likes: 128,
    comments: [
      {
        id: 40,
        author: "Hema",
        message: "Solid starting point for creator briefs.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 40,
    slug: "pricing-page-rewriter",
    title: "Pricing Page Rewriter",
    description: "Improve pricing page clarity, package differentiation, and CTA confidence.",
    category: "Marketing",
    rating: 4.7,
    sales: 717,
    creator: "Dylan Brooks",
    access: "free",
    excerpt:
      "Rewrite plans, features, and FAQs so pricing pages feel clearer, more trustworthy, and easier to compare.",
    likes: 138,
    comments: [
      {
        id: 41,
        author: "Suri",
        message: "Very handy for simplifying package language.",
        createdLabel: "3h ago",
      },
    ],
  },
  {
    id: 41,
    slug: "fiction-dialogue-polisher",
    title: "Fiction Dialogue Polisher",
    description: "Strengthen dialogue with sharper voice, rhythm, and subtext.",
    category: "Writing",
    rating: 4.8,
    sales: 624,
    creator: "Nina Flores",
    access: "free",
    excerpt:
      "Take flat dialogue and rewrite it with stronger characterization, tension, and pacing.",
    likes: 144,
    comments: [
      {
        id: 42,
        author: "Taran",
        message: "Helpful for making dialogue sound less generic.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 42,
    slug: "executive-summary-crafter",
    title: "Executive Summary Crafter",
    description: "Condense long reports into concise executive summaries with decisions and risks.",
    category: "Writing",
    rating: 4.6,
    sales: 509,
    creator: "Ivy Collins",
    access: "free",
    excerpt:
      "Summarize dense material into decision-ready briefs that surface conclusions without losing the key nuance.",
    likes: 97,
    comments: [
      {
        id: 43,
        author: "Aditya",
        message: "Useful for stakeholder updates.",
        createdLabel: "5d ago",
      },
    ],
  },
  {
    id: 43,
    slug: "youtube-script-outliner",
    title: "YouTube Script Outliner",
    description: "Outline stronger YouTube scripts with open loops, segments, and retention beats.",
    category: "Writing",
    rating: 4.7,
    sales: 733,
    creator: "Zoe Walker",
    access: "free",
    excerpt:
      "Turn a video idea into a tighter script structure with pacing, hooks, and clearer audience payoff.",
    likes: 156,
    comments: [
      {
        id: 44,
        author: "Keshav",
        message: "Nice framework for educational videos.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 44,
    slug: "research-note-synthesizer",
    title: "Research Note Synthesizer",
    description: "Organize scattered research notes into themes, insights, and next-step questions.",
    category: "Writing",
    rating: 4.5,
    sales: 392,
    creator: "Mila Novak",
    access: "free",
    excerpt:
      "Cluster notes into themes and produce a clearer narrative with open questions worth exploring next.",
    likes: 83,
    comments: [
      {
        id: 45,
        author: "Nav",
        message: "Helps make sense of a messy notebook.",
        createdLabel: "6d ago",
      },
    ],
  },
  {
    id: 45,
    slug: "premium-saas-growth-playbook",
    title: "Premium SaaS Growth Playbook",
    description: "Design premium growth experiments for SaaS teams with stronger prioritization.",
    category: "Marketing",
    rating: 5,
    sales: 276,
    creator: "Ethan Ross",
    access: "premium",
    excerpt:
      "A deeper playbook for diagnosing growth loops, prioritizing channels, and planning experiment sequencing.",
    likes: 74,
    comments: [
      {
        id: 46,
        author: "Kabir",
        message: "Feels more strategic than a typical growth prompt.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 46,
    slug: "premium-brand-system-blueprint",
    title: "Premium Brand System Blueprint",
    description: "Build a premium-ready brand system with voice, visual rules, and rollout guidance.",
    category: "Design",
    rating: 4.9,
    sales: 231,
    creator: "Elise Moore",
    access: "premium",
    excerpt:
      "Map a full brand system spanning tone, design principles, typography, color, and usage rules.",
    likes: 69,
    comments: [
      {
        id: 47,
        author: "Raghav",
        message: "Very complete prompt for identity direction.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 47,
    slug: "viral-thread-blueprinter",
    title: "Viral Thread Blueprinter",
    description: "Turn rough ideas into high-retention social threads with stronger pacing.",
    category: "Marketing",
    rating: 4.7,
    sales: 621,
    creator: "Talia Brooks",
    access: "free",
    excerpt:
      "Structure thread hooks, teachable beats, and CTA endings that feel sharp without sounding forced.",
    likes: 129,
    comments: [
      {
        id: 48,
        author: "Kunal",
        message: "Useful when a thread idea needs stronger sequencing.",
        createdLabel: "6h ago",
      },
    ],
  },
  {
    id: 48,
    slug: "app-store-copy-refiner",
    title: "App Store Copy Refiner",
    description: "Rewrite app store descriptions, feature bullets, and update notes for better conversion.",
    category: "Marketing",
    rating: 4.6,
    sales: 487,
    creator: "Nadia Perez",
    access: "free",
    excerpt:
      "Sharpen listing copy with clearer value framing, keyword coverage, and stronger feature hierarchy.",
    likes: 101,
    comments: [
      {
        id: 49,
        author: "Ritesh",
        message: "Nice for tightening app positioning fast.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 49,
    slug: "product-positioning-sprint",
    title: "Product Positioning Sprint",
    description: "Clarify product positioning, differentiation, and audience fit in one workflow.",
    category: "Marketing",
    rating: 4.9,
    sales: 1106,
    creator: "Hugo Ellis",
    access: "free",
    excerpt:
      "Map pains, alternatives, proof points, and messaging angles into a tighter positioning narrative.",
    likes: 214,
    comments: [
      {
        id: 50,
        author: "Megha",
        message: "Good at surfacing a clearer market angle.",
        createdLabel: "9h ago",
      },
    ],
  },
  {
    id: 50,
    slug: "founder-story-polisher",
    title: "Founder Story Polisher",
    description: "Turn a founder backstory into a more compelling brand narrative.",
    category: "Marketing",
    rating: 4.5,
    sales: 352,
    creator: "Iris Long",
    access: "free",
    excerpt:
      "Shape milestones, struggle, and mission into a story that feels believable and memorable.",
    likes: 84,
    comments: [
      {
        id: 51,
        author: "Ansh",
        message: "Helpful for about pages and founder intros.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 51,
    slug: "campaign-landing-page-kit",
    title: "Campaign Landing Page Kit",
    description: "Build campaign-specific landing pages with better flow and clearer CTA logic.",
    category: "Marketing",
    rating: 4.8,
    sales: 884,
    creator: "Shreya Kapoor",
    access: "free",
    excerpt:
      "Generate hero copy, proof sections, objections, and CTA structure aligned to a campaign brief.",
    likes: 173,
    comments: [
      {
        id: 52,
        author: "Mansi",
        message: "Strong when launching campaign-specific pages quickly.",
        createdLabel: "5h ago",
      },
    ],
  },
  {
    id: 52,
    slug: "premium-funnel-diagnostics-suite",
    title: "Premium Funnel Diagnostics Suite",
    description: "Audit signup funnels with advanced experiment ideas and conversion hypotheses.",
    category: "Marketing",
    rating: 5,
    sales: 241,
    creator: "Luca Benton",
    access: "premium",
    excerpt:
      "A deeper funnel analysis system for diagnosing drop-off and prioritizing growth experiments.",
    likes: 77,
    comments: [
      {
        id: 53,
        author: "Vivek",
        message: "Feels more strategic than a basic CRO prompt.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 53,
    slug: "brand-campaign-angle-generator",
    title: "Brand Campaign Angle Generator",
    description: "Generate campaign angles that connect product value with sharper audience emotion.",
    category: "Marketing",
    rating: 4.7,
    sales: 690,
    creator: "Daria Miles",
    access: "free",
    excerpt:
      "Stretch one campaign brief into multiple positioning angles, hooks, and creative territories.",
    likes: 144,
    comments: [
      {
        id: 54,
        author: "Parth",
        message: "Great for early campaign ideation.",
        createdLabel: "8h ago",
      },
    ],
  },
  {
    id: 54,
    slug: "retention-email-sequence-designer",
    title: "Retention Email Sequence Designer",
    description: "Design lifecycle emails that improve activation and reduce churn.",
    category: "Marketing",
    rating: 4.6,
    sales: 559,
    creator: "Celine Park",
    access: "free",
    excerpt:
      "Map user journeys into retention nudges, activation messages, and re-engagement touchpoints.",
    likes: 118,
    comments: [
      {
        id: 55,
        author: "Pranav",
        message: "Useful when retention messaging feels stale.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 55,
    slug: "niche-keyword-expander",
    title: "Niche Keyword Expander",
    description: "Find more specific keyword opportunities from one broad topic.",
    category: "Marketing",
    rating: 4.4,
    sales: 311,
    creator: "Tessa Green",
    access: "free",
    excerpt:
      "Expand a seed topic into search clusters, content ideas, and supporting keyword opportunities.",
    likes: 70,
    comments: [
      {
        id: 56,
        author: "Alok",
        message: "Good for uncovering content angles.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 56,
    slug: "b2b-offer-stack-builder",
    title: "B2B Offer Stack Builder",
    description: "Craft stronger B2B offers with packaging, proof, urgency, and objection handling.",
    category: "Marketing",
    rating: 4.8,
    sales: 928,
    creator: "Marco Silva",
    access: "free",
    excerpt:
      "Turn a service or SaaS package into a more convincing offer stack with clearer differentiation.",
    likes: 181,
    comments: [
      {
        id: 57,
        author: "Saket",
        message: "Very useful for clarifying offer structure.",
        createdLabel: "10h ago",
      },
    ],
  },
  {
    id: 57,
    slug: "lead-magnet-outline-studio",
    title: "Lead Magnet Outline Studio",
    description: "Outline better lead magnets for ebooks, checklists, and mini-guides.",
    category: "Marketing",
    rating: 4.5,
    sales: 398,
    creator: "Bianca Wells",
    access: "free",
    excerpt:
      "Create a stronger lead magnet with clearer transformation, structure, and conversion intent.",
    likes: 88,
    comments: [
      {
        id: 58,
        author: "Neel",
        message: "Nice for planning quick downloadable assets.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 58,
    slug: "design-critique-simulator",
    title: "Design Critique Simulator",
    description: "Review UI designs like a senior product designer with stronger specificity.",
    category: "Design",
    rating: 4.8,
    sales: 734,
    creator: "Camila Ford",
    access: "free",
    excerpt:
      "Spot hierarchy, usability, spacing, and clarity issues with structured critique language.",
    likes: 152,
    comments: [
      {
        id: 59,
        author: "Sarthak",
        message: "Helpful when preparing for design reviews.",
        createdLabel: "7h ago",
      },
    ],
  },
  {
    id: 59,
    slug: "hero-section-composer",
    title: "Hero Section Composer",
    description: "Generate bolder website hero concepts with layout and messaging direction.",
    category: "Design",
    rating: 4.7,
    sales: 681,
    creator: "Ari Sutton",
    access: "free",
    excerpt:
      "Translate a product brief into hero layouts, message hierarchy, and supporting visual notes.",
    likes: 146,
    comments: [
      {
        id: 60,
        author: "Pia",
        message: "Strong for getting out of generic hero layouts.",
        createdLabel: "12h ago",
      },
    ],
  },
  {
    id: 60,
    slug: "saas-pricing-table-designer",
    title: "SaaS Pricing Table Designer",
    description: "Create clearer SaaS pricing tables with stronger plan differentiation.",
    category: "Design",
    rating: 4.6,
    sales: 523,
    creator: "Harper Cole",
    access: "free",
    excerpt:
      "Clarify plan hierarchy, package framing, and visual emphasis for easier pricing comparisons.",
    likes: 115,
    comments: [
      {
        id: 61,
        author: "Ishan",
        message: "Useful for comparing pricing table directions.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 61,
    slug: "moodboard-concept-crafter",
    title: "Moodboard Concept Crafter",
    description: "Create cohesive moodboards from a short concept, audience, and tone brief.",
    category: "Design",
    rating: 4.5,
    sales: 410,
    creator: "Rosa Kim",
    access: "free",
    excerpt:
      "Turn abstract direction into a more tangible visual world with references, cues, and style anchors.",
    likes: 93,
    comments: [
      {
        id: 62,
        author: "Tushar",
        message: "Good for kickstarting concept boards.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 62,
    slug: "icon-system-planner",
    title: "Icon System Planner",
    description: "Design consistent icon systems with better naming, spacing, and style rules.",
    category: "Design",
    rating: 4.4,
    sales: 297,
    creator: "Elin West",
    access: "free",
    excerpt:
      "Organize icon direction, stroke choices, and naming logic so a set feels more systematic.",
    likes: 66,
    comments: [
      {
        id: 63,
        author: "Amol",
        message: "Helpful for tidying icon libraries.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 63,
    slug: "poster-series-expander",
    title: "Poster Series Expander",
    description: "Expand one poster concept into a stronger visual series with consistent logic.",
    category: "Design",
    rating: 4.9,
    sales: 842,
    creator: "Mika Rowan",
    access: "free",
    excerpt:
      "Generate a multi-poster system with compositional variation and a stronger visual spine.",
    likes: 198,
    comments: [
      {
        id: 64,
        author: "Dhruv",
        message: "Very good for developing a fuller visual family.",
        createdLabel: "6h ago",
      },
    ],
  },
  {
    id: 64,
    slug: "onboarding-ui-storyboarder",
    title: "Onboarding UI Storyboarder",
    description: "Storyboard better app onboarding flows with clearer value communication.",
    category: "Design",
    rating: 4.7,
    sales: 612,
    creator: "Jenna Park",
    access: "free",
    excerpt:
      "Map first-run screens, user questions, and visual pacing into a more coherent onboarding journey.",
    likes: 124,
    comments: [
      {
        id: 65,
        author: "Rohit",
        message: "Useful when onboarding feels too dense.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 65,
    slug: "premium-design-system-auditor",
    title: "Premium Design System Auditor",
    description: "Audit design systems for scalability, token hygiene, and component consistency.",
    category: "Design",
    rating: 5,
    sales: 224,
    creator: "Megan Holt",
    access: "premium",
    excerpt:
      "A deeper system review prompt focused on governance, naming, maintenance, and scale readiness.",
    likes: 73,
    comments: [
      {
        id: 66,
        author: "Manan",
        message: "Great for advanced design system cleanup.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 66,
    slug: "product-illustration-brief-maker",
    title: "Product Illustration Brief Maker",
    description: "Create better illustration briefs for product marketing and onboarding screens.",
    category: "Design",
    rating: 4.6,
    sales: 456,
    creator: "Noelle Hart",
    access: "free",
    excerpt:
      "Translate product stories into illustration systems, motifs, and usage guidance with more clarity.",
    likes: 108,
    comments: [
      {
        id: 67,
        author: "Harini",
        message: "Helpful for art direction briefs.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 67,
    slug: "presentation-deck-designer",
    title: "Presentation Deck Designer",
    description: "Improve pitch and strategy decks with stronger slide logic and narrative flow.",
    category: "Design",
    rating: 4.8,
    sales: 775,
    creator: "Felix Ward",
    access: "free",
    excerpt:
      "Restructure a rough deck into clearer sections, stronger pacing, and cleaner slide hierarchy.",
    likes: 162,
    comments: [
      {
        id: 68,
        author: "Rahul",
        message: "Good for turning messy decks into stories.",
        createdLabel: "9h ago",
      },
    ],
  },
  {
    id: 68,
    slug: "ui-copy-layout-pairer",
    title: "UI Copy Layout Pairer",
    description: "Pair UI copy decisions with layout suggestions for clearer product screens.",
    category: "Design",
    rating: 4.5,
    sales: 372,
    creator: "Asha Bell",
    access: "free",
    excerpt:
      "Connect wording and layout decisions so screens feel more understandable and less crowded.",
    likes: 82,
    comments: [
      {
        id: 69,
        author: "Sonia",
        message: "Nice bridge between UX writing and layout thinking.",
        createdLabel: "5d ago",
      },
    ],
  },
  {
    id: 69,
    slug: "bug-report-triager",
    title: "Bug Report Triager",
    description: "Turn vague bug reports into better hypotheses, checks, and reproduction paths.",
    category: "Coding",
    rating: 4.7,
    sales: 688,
    creator: "Jon Mercer",
    access: "free",
    excerpt:
      "Structure vague issue reports into likely causes, debugging steps, and risk-aware next actions.",
    likes: 141,
    comments: [
      {
        id: 70,
        author: "Yatin",
        message: "Helpful when bug reports come in half-baked.",
        createdLabel: "6h ago",
      },
    ],
  },
  {
    id: 70,
    slug: "backend-endpoint-designer",
    title: "Backend Endpoint Designer",
    description: "Design cleaner backend endpoints with validation, auth, and response structure.",
    category: "Coding",
    rating: 4.8,
    sales: 829,
    creator: "Pavel Grant",
    access: "free",
    excerpt:
      "Turn a rough API idea into clearer routes, validation strategy, and error response conventions.",
    likes: 171,
    comments: [
      {
        id: 71,
        author: "Navin",
        message: "Strong for structuring service endpoints.",
        createdLabel: "11h ago",
      },
    ],
  },
  {
    id: 71,
    slug: "refactor-boundary-mapper",
    title: "Refactor Boundary Mapper",
    description: "Break large refactors into safer, staged slices with clearer boundaries.",
    category: "Coding",
    rating: 4.9,
    sales: 953,
    creator: "Clive Raymond",
    access: "free",
    excerpt:
      "Identify seams, migration order, and rollback-safe slices before starting a risky refactor.",
    likes: 209,
    comments: [
      {
        id: 72,
        author: "Nikhil",
        message: "Excellent for planning large refactors calmly.",
        createdLabel: "8h ago",
      },
    ],
  },
  {
    id: 72,
    slug: "python-cli-toolmaker",
    title: "Python CLI Toolmaker",
    description: "Create practical CLI tool prompts with arguments, flows, and error handling.",
    category: "Coding",
    rating: 4.6,
    sales: 477,
    creator: "Saira Malik",
    access: "free",
    excerpt:
      "Generate command structure, UX, and implementation scaffolding for useful Python CLI tools.",
    likes: 103,
    comments: [
      {
        id: 73,
        author: "Tejas",
        message: "Nice when starting internal tool ideas.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 73,
    slug: "nextjs-route-optimizer",
    title: "Next.js Route Optimizer",
    description: "Improve route structure, data fetching, and loading UX in Next.js apps.",
    category: "Coding",
    rating: 4.8,
    sales: 743,
    creator: "Lena Fox",
    access: "free",
    excerpt:
      "Review route boundaries, server/client splits, and loading strategies for cleaner app flows.",
    likes: 156,
    comments: [
      {
        id: 74,
        author: "Om",
        message: "Useful when a Next app starts feeling tangled.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 74,
    slug: "database-schema-thinker",
    title: "Database Schema Thinker",
    description: "Model backend data with cleaner relationships, constraints, and query tradeoffs.",
    category: "Coding",
    rating: 4.7,
    sales: 622,
    creator: "Ivo Martin",
    access: "free",
    excerpt:
      "Turn app requirements into a more maintainable schema with better indexing and query awareness.",
    likes: 132,
    comments: [
      {
        id: 75,
        author: "Apoorv",
        message: "Good for thinking through schema changes.",
        createdLabel: "4h ago",
      },
    ],
  },
  {
    id: 75,
    slug: "premium-system-design-coach",
    title: "Premium System Design Coach",
    description: "Walk through larger architecture tradeoffs with clearer decision frameworks.",
    category: "Coding",
    rating: 5,
    sales: 264,
    creator: "Troy Bennett",
    access: "premium",
    excerpt:
      "A deeper systems-thinking prompt for architecture interviews, platform design, and tradeoff reasoning.",
    likes: 81,
    comments: [
      {
        id: 76,
        author: "Ved",
        message: "Great for more advanced architecture practice.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 76,
    slug: "graphql-query-planner",
    title: "GraphQL Query Planner",
    description: "Shape GraphQL operations, fragments, and resolver thinking more clearly.",
    category: "Coding",
    rating: 4.5,
    sales: 369,
    creator: "Mara Dunn",
    access: "free",
    excerpt:
      "Clarify query structure, resolver boundaries, and over-fetching risks before implementation.",
    likes: 79,
    comments: [
      {
        id: 77,
        author: "Arpit",
        message: "Good for planning GraphQL work upfront.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 77,
    slug: "testing-strategy-mapper",
    title: "Testing Strategy Mapper",
    description: "Map feature requirements to better unit, integration, and end-to-end test layers.",
    category: "Coding",
    rating: 4.9,
    sales: 899,
    creator: "Jade Harmon",
    access: "free",
    excerpt:
      "Turn risky flows into a layered testing plan with stronger edge-case and regression coverage.",
    likes: 193,
    comments: [
      {
        id: 78,
        author: "Aayush",
        message: "Very practical for planning test coverage.",
        createdLabel: "7h ago",
      },
    ],
  },
  {
    id: 78,
    slug: "pr-description-writer",
    title: "PR Description Writer",
    description: "Write cleaner pull request descriptions with impact, scope, and reviewer context.",
    category: "Coding",
    rating: 4.4,
    sales: 286,
    creator: "Riley Adams",
    access: "free",
    excerpt:
      "Turn raw implementation notes into a PR summary that is easier for teammates to review quickly.",
    likes: 63,
    comments: [
      {
        id: 79,
        author: "Laksh",
        message: "Makes PRs much easier to communicate.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 79,
    slug: "codebase-onboarding-guide",
    title: "Codebase Onboarding Guide",
    description: "Explain unfamiliar codebases with clearer modules, flows, and entry points.",
    category: "Coding",
    rating: 4.8,
    sales: 711,
    creator: "Milo Stern",
    access: "free",
    excerpt:
      "Summarize architecture, major flows, and where to start so new contributors get unstuck faster.",
    likes: 147,
    comments: [
      {
        id: 80,
        author: "Prisha",
        message: "Great for getting oriented in older repos.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 80,
    slug: "bugfix-commit-planner",
    title: "Bugfix Commit Planner",
    description: "Break bugfix work into safer commits with clearer rollback points.",
    category: "Coding",
    rating: 4.6,
    sales: 433,
    creator: "Damon Reed",
    access: "free",
    excerpt:
      "Turn a tangled fix into a smaller staged plan with checks, validation points, and safer sequencing.",
    likes: 94,
    comments: [
      {
        id: 81,
        author: "Uday",
        message: "Helpful for taming messy bugfixes.",
        createdLabel: "5d ago",
      },
    ],
  },
  {
    id: 81,
    slug: "novel-chapter-outliner",
    title: "Novel Chapter Outliner",
    description: "Outline stronger novel chapters with tension beats and clearer scene objectives.",
    category: "Writing",
    rating: 4.7,
    sales: 541,
    creator: "Alicia Grant",
    access: "free",
    excerpt:
      "Break a chapter idea into scene goals, reversals, and pacing beats without losing narrative momentum.",
    likes: 117,
    comments: [
      {
        id: 82,
        author: "Mrunal",
        message: "Good for turning a vague scene idea into a plan.",
        createdLabel: "9h ago",
      },
    ],
  },
  {
    id: 82,
    slug: "script-hook-generator",
    title: "Script Hook Generator",
    description: "Generate stronger hooks for video scripts, podcasts, and explainers.",
    category: "Writing",
    rating: 4.6,
    sales: 462,
    creator: "Daphne Holt",
    access: "free",
    excerpt:
      "Shape opening lines and lead-ins that build curiosity without sounding exaggerated.",
    likes: 102,
    comments: [
      {
        id: 83,
        author: "Kriti",
        message: "Useful for improving first 15 seconds.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 83,
    slug: "longform-article-architect",
    title: "Longform Article Architect",
    description: "Build stronger longform articles with better structure, transitions, and pacing.",
    category: "Writing",
    rating: 4.9,
    sales: 1008,
    creator: "Simon Vale",
    access: "free",
    excerpt:
      "Map a big topic into sections, argument flow, and clearer reader progression from start to finish.",
    likes: 215,
    comments: [
      {
        id: 84,
        author: "Anvita",
        message: "Great for making large articles feel more deliberate.",
        createdLabel: "7h ago",
      },
    ],
  },
  {
    id: 84,
    slug: "landing-page-headline-lab",
    title: "Landing Page Headline Lab",
    description: "Generate stronger headline families for landing pages and product launches.",
    category: "Writing",
    rating: 4.8,
    sales: 781,
    creator: "Molly Finch",
    access: "free",
    excerpt:
      "Explore clarity-first, authority-driven, and curiosity-led headline directions from one brief.",
    likes: 164,
    comments: [
      {
        id: 85,
        author: "Jay",
        message: "Useful when a hero headline feels flat.",
        createdLabel: "10h ago",
      },
    ],
  },
  {
    id: 85,
    slug: "case-study-interview-helper",
    title: "Case Study Interview Helper",
    description: "Prepare better customer interview questions for case study gathering.",
    category: "Writing",
    rating: 4.5,
    sales: 348,
    creator: "Erin Scott",
    access: "free",
    excerpt:
      "Turn vague customer win stories into sharper questions that surface believable transformation details.",
    likes: 76,
    comments: [
      {
        id: 86,
        author: "Pawan",
        message: "Good for planning customer interviews.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 86,
    slug: "premium-book-proposal-builder",
    title: "Premium Book Proposal Builder",
    description: "Develop a more polished nonfiction book proposal with market and positioning logic.",
    category: "Writing",
    rating: 5,
    sales: 205,
    creator: "Vivian Reed",
    access: "premium",
    excerpt:
      "A deeper publishing prompt for shaping book concept, audience, sample chapters, and proposal framing.",
    likes: 67,
    comments: [
      {
        id: 87,
        author: "Raina",
        message: "Feels more structured than generic proposal prompts.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 87,
    slug: "voice-and-tone-playbook",
    title: "Voice And Tone Playbook",
    description: "Document a stronger voice and tone system for teams writing across many surfaces.",
    category: "Writing",
    rating: 4.7,
    sales: 635,
    creator: "Rhea Simmons",
    access: "free",
    excerpt:
      "Create tone ranges, example rewrites, and usage rules that make brand writing more repeatable.",
    likes: 133,
    comments: [
      {
        id: 88,
        author: "Farhan",
        message: "Helpful for building a usable writing playbook.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 88,
    slug: "argument-essay-planner",
    title: "Argument Essay Planner",
    description: "Plan stronger argumentative essays with thesis clarity and evidence structure.",
    category: "Writing",
    rating: 4.4,
    sales: 295,
    creator: "Nora West",
    access: "free",
    excerpt:
      "Shape an argument into claims, counters, evidence, and conclusion flow that feels more convincing.",
    likes: 64,
    comments: [
      {
        id: 89,
        author: "Deep",
        message: "Nice structure for academic drafts.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 89,
    slug: "feature-announcement-ghostwriter",
    title: "Feature Announcement Ghostwriter",
    description: "Draft sharper feature launch posts, changelogs, and customer-facing updates.",
    category: "Writing",
    rating: 4.8,
    sales: 722,
    creator: "Oscar Hale",
    access: "free",
    excerpt:
      "Turn release notes into clearer announcement copy with user value, highlights, and stronger framing.",
    likes: 151,
    comments: [
      {
        id: 90,
        author: "Sneha",
        message: "Useful for turning changelogs into better copy.",
        createdLabel: "8h ago",
      },
    ],
  },
  {
    id: 90,
    slug: "newsletter-hook-bank",
    title: "Newsletter Hook Bank",
    description: "Generate better opening hooks for editorial and marketing newsletters.",
    category: "Writing",
    rating: 4.6,
    sales: 414,
    creator: "Penny Cross",
    access: "free",
    excerpt:
      "Create a bank of stronger intros that set tone, context, and curiosity more effectively.",
    likes: 91,
    comments: [
      {
        id: 91,
        author: "Rutuja",
        message: "Good for making newsletter openings less repetitive.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 91,
    slug: "creative-brief-refiner",
    title: "Creative Brief Refiner",
    description: "Turn a weak creative brief into something clearer, more actionable, and more inspiring.",
    category: "Marketing",
    rating: 4.7,
    sales: 603,
    creator: "Liam Voss",
    access: "free",
    excerpt:
      "Clarify audience, objective, proof, and tone so creative work starts from a stronger brief.",
    likes: 126,
    comments: [
      {
        id: 92,
        author: "Neeraj",
        message: "Makes rough briefs much easier to act on.",
        createdLabel: "13h ago",
      },
    ],
  },
  {
    id: 92,
    slug: "founder-linkedin-carousel-writer",
    title: "Founder LinkedIn Carousel Writer",
    description: "Write stronger LinkedIn carousel copy for founder-led storytelling and education.",
    category: "Marketing",
    rating: 4.5,
    sales: 381,
    creator: "Tina Wells",
    access: "free",
    excerpt:
      "Turn an insight or lesson into clearer slide-by-slide carousel copy with narrative tension.",
    likes: 85,
    comments: [
      {
        id: 93,
        author: "Aman",
        message: "Great for carousel structure.",
        createdLabel: "1d ago",
      },
    ],
  },
  {
    id: 93,
    slug: "community-post-idea-engine",
    title: "Community Post Idea Engine",
    description: "Generate better prompts for community engagement, replies, and discussion starters.",
    category: "Marketing",
    rating: 4.4,
    sales: 274,
    creator: "Lara Kent",
    access: "free",
    excerpt:
      "Produce more interactive post ideas for brand communities, newsletters, and member groups.",
    likes: 61,
    comments: [
      {
        id: 94,
        author: "Yogesh",
        message: "Helpful for keeping community content fresh.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 94,
    slug: "sales-call-objection-mapper",
    title: "Sales Call Objection Mapper",
    description: "Prepare better responses to objections across sales calls and demos.",
    category: "Marketing",
    rating: 4.8,
    sales: 805,
    creator: "Brett Allen",
    access: "free",
    excerpt:
      "Map common objections to context-aware responses, reframes, and proof-driven follow-ups.",
    likes: 166,
    comments: [
      {
        id: 95,
        author: "Shiv",
        message: "Useful for sharpening demo call prep.",
        createdLabel: "7h ago",
      },
    ],
  },
  {
    id: 95,
    slug: "premium-go-to-market-planner",
    title: "Premium Go-To-Market Planner",
    description: "Design go-to-market plans with positioning, launch channels, and sequencing logic.",
    category: "Marketing",
    rating: 5,
    sales: 232,
    creator: "Kira Bloom",
    access: "premium",
    excerpt:
      "A more strategic GTM planning prompt for launches, experiments, messaging, and team coordination.",
    likes: 72,
    comments: [
      {
        id: 96,
        author: "Abhi",
        message: "Feels solid for structured GTM planning.",
        createdLabel: "Last week",
      },
    ],
  },
  {
    id: 96,
    slug: "logo-iteration-expander",
    title: "Logo Iteration Expander",
    description: "Expand one logo idea into multiple stronger iterations with clearer rationale.",
    category: "Design",
    rating: 4.6,
    sales: 447,
    creator: "Mona Rivers",
    access: "free",
    excerpt:
      "Take one logo direction and push it into varied systems, refinements, and brand-fit alternatives.",
    likes: 99,
    comments: [
      {
        id: 97,
        author: "Ila",
        message: "Useful when exploring second-round logo options.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 97,
    slug: "design-qa-checklist-maker",
    title: "Design QA Checklist Maker",
    description: "Create cleaner UI QA checklists for responsive states, spacing, and usability polish.",
    category: "Design",
    rating: 4.5,
    sales: 338,
    creator: "Quinn Ellis",
    access: "free",
    excerpt:
      "Generate QA checkpoints for breakpoints, hierarchy, states, accessibility cues, and spacing consistency.",
    likes: 74,
    comments: [
      {
        id: 98,
        author: "Naveen",
        message: "Good for preparing final design QA passes.",
        createdLabel: "4d ago",
      },
    ],
  },
  {
    id: 98,
    slug: "storybook-showcase-writer",
    title: "Storybook Showcase Writer",
    description: "Document components more clearly with usage notes, edge cases, and examples.",
    category: "Design",
    rating: 4.7,
    sales: 589,
    creator: "Mira Sloan",
    access: "free",
    excerpt:
      "Turn raw components into cleaner showcase docs with state coverage and clearer implementation notes.",
    likes: 121,
    comments: [
      {
        id: 99,
        author: "Tarun",
        message: "Helpful for documenting component systems.",
        createdLabel: "9h ago",
      },
    ],
  },
  {
    id: 99,
    slug: "webflow-layout-director",
    title: "Webflow Layout Director",
    description: "Plan stronger landing page structures and section systems for Webflow builds.",
    category: "Design",
    rating: 4.4,
    sales: 263,
    creator: "Sage Howard",
    access: "free",
    excerpt:
      "Turn a page brief into clearer section architecture, layout rhythm, and content hierarchy.",
    likes: 59,
    comments: [
      {
        id: 100,
        author: "Akhil",
        message: "Useful for structuring pages before building.",
        createdLabel: "3d ago",
      },
    ],
  },
  {
    id: 100,
    slug: "feature-roadmap-clarifier",
    title: "Feature Roadmap Clarifier",
    description: "Turn roadmap ideas into clearer milestones, scope boundaries, and release narratives.",
    category: "Coding",
    rating: 4.8,
    sales: 812,
    creator: "Nolan Price",
    access: "free",
    excerpt:
      "Structure feature bets into milestones, sequencing, dependencies, and release-ready communication.",
    likes: 168,
    comments: [
      {
        id: 101,
        author: "Varun",
        message: "Great for cleaning up roadmap thinking.",
        createdLabel: "6h ago",
      },
    ],
  },
  {
    id: 101,
    slug: "api-contract-reviewer",
    title: "API Contract Reviewer",
    description: "Review API request and response contracts for consistency and consumer clarity.",
    category: "Coding",
    rating: 4.7,
    sales: 617,
    creator: "Zane Cole",
    access: "free",
    excerpt:
      "Spot naming drift, validation gaps, and payload inconsistencies before frontend/backend divergence grows.",
    likes: 127,
    comments: [
      {
        id: 102,
        author: "Hitesh",
        message: "Helpful for catching contract drift early.",
        createdLabel: "Yesterday",
      },
    ],
  },
  {
    id: 102,
    slug: "migration-plan-builder",
    title: "Migration Plan Builder",
    description: "Build safer rollout plans for schema, API, and infrastructure migrations.",
    category: "Coding",
    rating: 4.9,
    sales: 874,
    creator: "Greta Miles",
    access: "free",
    excerpt:
      "Turn a risky migration into phased steps with guardrails, cutover thinking, and rollback plans.",
    likes: 186,
    comments: [
      {
        id: 103,
        author: "Naman",
        message: "Very practical for planning migrations safely.",
        createdLabel: "11h ago",
      },
    ],
  },
  {
    id: 103,
    slug: "performance-bottleneck-auditor",
    title: "Performance Bottleneck Auditor",
    description: "Diagnose likely frontend and backend performance bottlenecks with more structure.",
    category: "Coding",
    rating: 4.8,
    sales: 792,
    creator: "Ruben Lowe",
    access: "free",
    excerpt:
      "Turn sluggish app behavior into a sharper audit across rendering, network, data, and caching layers.",
    likes: 163,
    comments: [
      {
        id: 104,
        author: "Nitya",
        message: "Useful when performance work feels too broad.",
        createdLabel: "8h ago",
      },
    ],
  },
  {
    id: 104,
    slug: "technical-debt-prioritizer",
    title: "Technical Debt Prioritizer",
    description: "Prioritize technical debt with stronger reasoning around impact, risk, and effort.",
    category: "Coding",
    rating: 4.6,
    sales: 458,
    creator: "Elio Marsh",
    access: "free",
    excerpt:
      "Sort debt items into a clearer sequence using user impact, delivery risk, and maintenance cost.",
    likes: 96,
    comments: [
      {
        id: 105,
        author: "Sagar",
        message: "Nice for making debt discussions more concrete.",
        createdLabel: "2d ago",
      },
    ],
  },
  {
    id: 105,
    slug: "dialogue-subtext-enhancer",
    title: "Dialogue Subtext Enhancer",
    description: "Rewrite scenes so dialogue carries more subtext, conflict, and personality.",
    category: "Writing",
    rating: 4.8,
    sales: 608,
    creator: "Naomi Price",
    access: "free",
    excerpt:
      "Take direct dialogue and rework it into sharper exchanges with hidden tension and stronger voice.",
    likes: 136,
    comments: [
      {
        id: 106,
        author: "Ritika",
        message: "Great for making scenes feel less on-the-nose.",
        createdLabel: "10h ago",
      },
    ],
  },
  {
    id: 106,
    slug: "premium-narrative-arc-designer",
    title: "Premium Narrative Arc Designer",
    description: "Design more complex story arcs with stronger emotional progression and payoff.",
    category: "Writing",
    rating: 5,
    sales: 213,
    creator: "Loren Chase",
    access: "premium",
    excerpt:
      "A deeper storytelling prompt for shaping long-form arcs, turning points, and thematic cohesion.",
    likes: 71,
    comments: [
      {
        id: 107,
        author: "Pallavi",
        message: "Feels much richer than a basic plot prompt.",
        createdLabel: "Last week",
      },
    ],
  },
];

export const categories = ["All", "Writing", "Design", "Coding", "Marketing"];

export const freePrompts = prompts.filter((prompt) => prompt.access === "free");
export const premiumPrompts = prompts.filter((prompt) => prompt.access === "premium");

function getCurrentStorageScope() {
  if (typeof window === "undefined") {
    return "guest";
  }

  try {
    const raw = window.localStorage.getItem("promptx.user");
    const user = raw ? (JSON.parse(raw) as StorageScopedUser) : null;

    if (user?.id) {
      return user.id;
    }

    if (user?.email) {
      return user.email.toLowerCase();
    }
  } catch {
    return "guest";
  }

  return "guest";
}

function getScopedStorageKey(baseKey: string) {
  return `${baseKey}:${getCurrentStorageScope()}`;
}

export function calculatePromptEngagement(prompt: Prompt) {
  return (
    prompt.likes * 4 +
    prompt.comments.length * 3 +
    prompt.sales * 0.12 +
    prompt.rating * 20
  );
}

export function rankPromptsByEngagement(items: Prompt[]) {
  return [...items].sort((left, right) => {
    const scoreDifference =
      calculatePromptEngagement(right) - calculatePromptEngagement(left);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return right.likes - left.likes;
  });
}

export function getStoredPromptLikes() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(
      getScopedStorageKey(PROMPT_LIKES_STORAGE_KEY)
    );
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function isPromptLiked(slug: string) {
  return Boolean(getStoredPromptLikes()[slug]);
}

export function toggleStoredPromptLike(slug: string) {
  const storedLikes = getStoredPromptLikes();
  const nextLiked = !storedLikes[slug];

  if (nextLiked) {
    storedLikes[slug] = true;
  } else {
    delete storedLikes[slug];
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      getScopedStorageKey(PROMPT_LIKES_STORAGE_KEY),
      JSON.stringify(storedLikes)
    );
  }

  return nextLiked;
}

export function hydratePromptLikes(items: Prompt[]) {
  const storedLikes = getStoredPromptLikes();

  return items.map((prompt) => ({
    ...prompt,
    likes: prompt.likes + (storedLikes[prompt.slug] ? 1 : 0),
  }));
}

export function getStoredSavedPrompts() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(
      getScopedStorageKey(PROMPT_SAVES_STORAGE_KEY)
    );
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function isPromptSaved(slug: string) {
  return Boolean(getStoredSavedPrompts()[slug]);
}

export function toggleStoredPromptSave(slug: string) {
  const storedSaves = getStoredSavedPrompts();
  const nextSaved = !storedSaves[slug];

  if (nextSaved) {
    storedSaves[slug] = true;
  } else {
    delete storedSaves[slug];
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      getScopedStorageKey(PROMPT_SAVES_STORAGE_KEY),
      JSON.stringify(storedSaves)
    );
  }

  return nextSaved;
}

export function getPromptBySlug(slug: string) {
  return prompts.find((prompt) => prompt.slug === slug);
}

export function getRelatedPrompts(currentPrompt: Prompt) {
  return rankPromptsByEngagement(
    freePrompts
    .filter((prompt) => prompt.slug !== currentPrompt.slug)
    .sort((left, right) => {
      if (left.category === currentPrompt.category && right.category !== currentPrompt.category) {
        return -1;
      }

      if (right.category === currentPrompt.category && left.category !== currentPrompt.category) {
        return 1;
      }

      return right.rating - left.rating;
    })
  ).slice(0, 4);
}
