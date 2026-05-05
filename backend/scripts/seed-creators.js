require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Prompt = require("../src/models/Prompt");
const { PROMPT_STATUS, EVALUATION_STATUS } = require("../src/constants/prompt");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/promptx";
const DEFAULT_PASSWORD = process.env.SEED_CREATOR_PASSWORD || "PromptX@2026";

const creators = [
  {
    name: "Anika Rao",
    email: "anika.rao.creator@promptx.local",
    bio: "Builds practical marketing and creator-workflow prompts for founders, solo teams, and content operators.",
    favoriteTags: ["marketing", "content", "growth", "linkedin"],
    prompts: [
      {
        title: "LinkedIn Authority Post Builder",
        slug: "linkedin-authority-post-builder",
        description:
          "Turn a rough idea into a credible LinkedIn post with a sharp hook, clear structure, and practical takeaways.",
        content:
          "Act as a senior LinkedIn ghostwriter. Ask for the topic, audience, point of view, proof, and desired tone. Produce five hook options, one polished post, three CTA variants, and a short edit checklist.",
        category: "Marketing",
        tags: ["linkedin", "content", "personal-branding", "writing"],
        aiScore: { clarity: 91, creativity: 86, relevance: 93, overall: 90 },
        ratingAverage: 4.8,
        ratingCount: 42,
        reviewCount: 18,
        favoriteCount: 126,
        likeCount: 214,
        views: 4820,
        engagementScore: 356,
        rankingScore: 934,
      },
    ],
  },
  {
    name: "Marcus Bennett",
    email: "marcus.bennett.creator@promptx.local",
    bio: "Product strategist focused on discovery, positioning, and launch planning for early-stage SaaS teams.",
    favoriteTags: ["product", "saas", "strategy", "research"],
    prompts: [
      {
        title: "SaaS Positioning Sprint",
        slug: "saas-positioning-sprint",
        description:
          "Clarify your SaaS positioning with target segments, alternatives, category framing, and proof points.",
        content:
          "Act as a SaaS positioning consultant. Interview me about customer segments, current alternatives, product strengths, pricing, and evidence. Return a positioning canvas, homepage headline options, objections, and a launch narrative.",
        category: "Business",
        tags: ["saas", "positioning", "product-marketing", "strategy"],
        aiScore: { clarity: 94, creativity: 82, relevance: 92, overall: 91 },
        ratingAverage: 4.7,
        ratingCount: 37,
        reviewCount: 14,
        favoriteCount: 98,
        likeCount: 176,
        views: 3960,
        engagementScore: 298,
        rankingScore: 881,
      },
    ],
  },
  {
    name: "Leah Kim",
    email: "leah.kim.creator@promptx.local",
    bio: "Design systems writer creating prompts for UX audits, component specs, and interface critique.",
    favoriteTags: ["ux", "design", "audit", "systems"],
    prompts: [
      {
        title: "UX Audit Report Generator",
        slug: "ux-audit-report-generator",
        description:
          "Convert product screenshots or notes into a structured UX audit with severity, fixes, and user impact.",
        content:
          "Act as a senior UX auditor. Review the described screen, workflow, audience, and goal. Identify usability issues, assign severity, explain user impact, and propose specific interface changes with acceptance criteria.",
        category: "Design",
        tags: ["ux", "audit", "design-systems", "product"],
        aiScore: { clarity: 89, creativity: 84, relevance: 91, overall: 88 },
        ratingAverage: 4.9,
        ratingCount: 31,
        reviewCount: 12,
        favoriteCount: 87,
        likeCount: 151,
        views: 3425,
        engagementScore: 271,
        rankingScore: 846,
      },
    ],
  },
  {
    name: "Rohan Mehta",
    email: "rohan.mehta.creator@promptx.local",
    bio: "Engineering lead publishing prompts for code review, refactoring plans, and production debugging.",
    favoriteTags: ["coding", "debugging", "architecture", "review"],
    prompts: [
      {
        title: "Production Bug Triage Assistant",
        slug: "production-bug-triage-assistant",
        description:
          "Analyze bug reports, logs, recent changes, and system context to produce a clear triage plan.",
        content:
          "Act as a staff engineer debugging a production issue. Ask for symptoms, logs, deploy history, affected users, and reproduction steps. Return likely causes, evidence to collect, rollback criteria, and a prioritized fix plan.",
        category: "Coding",
        tags: ["debugging", "incident-response", "backend", "engineering"],
        aiScore: { clarity: 93, creativity: 80, relevance: 95, overall: 92 },
        ratingAverage: 4.8,
        ratingCount: 49,
        reviewCount: 20,
        favoriteCount: 134,
        likeCount: 238,
        views: 5290,
        engagementScore: 389,
        rankingScore: 958,
      },
    ],
  },
  {
    name: "Sofia Alvarez",
    email: "sofia.alvarez.creator@promptx.local",
    bio: "Operations consultant creating prompts for SOPs, hiring systems, onboarding, and team execution.",
    favoriteTags: ["operations", "hiring", "sop", "management"],
    prompts: [
      {
        title: "Team SOP Builder",
        slug: "team-sop-builder",
        description:
          "Turn messy process notes into a reusable SOP with roles, steps, checks, and escalation paths.",
        content:
          "Act as an operations lead. Ask for the process goal, owner, inputs, tools, handoffs, risks, and quality checks. Produce a concise SOP, checklist, responsibility map, and improvement questions.",
        category: "Productivity",
        tags: ["operations", "sop", "process", "productivity"],
        aiScore: { clarity: 92, creativity: 78, relevance: 90, overall: 88 },
        ratingAverage: 4.6,
        ratingCount: 28,
        reviewCount: 9,
        favoriteCount: 73,
        likeCount: 129,
        views: 2880,
        engagementScore: 224,
        rankingScore: 792,
      },
    ],
  },
  {
    name: "Nadia Okafor",
    email: "nadia.okafor.creator@promptx.local",
    bio: "Research strategist helping teams synthesize interviews, surveys, and competitive intelligence.",
    favoriteTags: ["research", "analysis", "customers", "insights"],
    prompts: [
      {
        title: "Customer Interview Synthesizer",
        slug: "customer-interview-synthesizer",
        description:
          "Extract themes, pain points, objections, and opportunity areas from customer interview notes.",
        content:
          "Act as a user research lead. Read the interview notes and organize findings into themes, quotes, jobs-to-be-done, unmet needs, contradictions, and product opportunities. Include confidence levels and follow-up questions.",
        category: "Research",
        tags: ["research", "customer-discovery", "insights", "product"],
        aiScore: { clarity: 90, creativity: 81, relevance: 94, overall: 90 },
        ratingAverage: 4.7,
        ratingCount: 35,
        reviewCount: 13,
        favoriteCount: 91,
        likeCount: 167,
        views: 3740,
        engagementScore: 286,
        rankingScore: 862,
      },
    ],
  },
];

async function seedCreators() {
  await mongoose.connect(MONGODB_URI);

  const passwordHash = await User.hashPassword(DEFAULT_PASSWORD);
  let userCount = 0;
  let promptCount = 0;

  for (const creator of creators) {
    const user = await User.findOneAndUpdate(
      { email: creator.email },
      {
        name: creator.name,
        email: creator.email,
        passwordHash,
        bio: creator.bio,
        favoriteTags: creator.favoriteTags,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
    userCount += 1;

    for (const prompt of creator.prompts) {
      await Prompt.findOneAndUpdate(
        { slug: prompt.slug },
        {
          ...prompt,
          status: PROMPT_STATUS.PUBLISHED,
          evaluationStatus: EVALUATION_STATUS.COMPLETED,
          evaluationSummary:
            "Seeded marketplace prompt with strong clarity, practical structure, and clear user value.",
          evaluationSource: "seed",
          author: user._id,
        },
        {
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
      promptCount += 1;
    }
  }

  console.log(`Seeded ${userCount} creators and ${promptCount} published prompts.`);
}

seedCreators()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
