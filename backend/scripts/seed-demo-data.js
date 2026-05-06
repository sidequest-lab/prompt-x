require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Prompt = require("../src/models/Prompt");
const Review = require("../src/models/Review");
const Like = require("../src/models/Like");
const Favorite = require("../src/models/Favorite");
const UserActivity = require("../src/models/UserActivity");
const { PROMPT_STATUS, EVALUATION_STATUS, ACTIVITY_TYPES } = require("../src/constants/prompt");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/promptx";
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "PromptX@2026";
const SHOULD_RESET = String(process.env.SEED_RESET || "true").toLowerCase() === "true";

const creators = [
  {
    name: "Anika Rao",
    email: "anika.rao.creator@promptx.local",
    bio: "Builds practical marketing and creator-workflow prompts for founders and creator-led teams.",
    favoriteTags: ["marketing", "content", "growth", "linkedin"],
    prompts: [
      {
        title: "LinkedIn Authority Post Builder",
        slug: "linkedin-authority-post-builder",
        description: "Turn a rough idea into a high-trust LinkedIn post with a clear argument and practical takeaway.",
        content: "Act as a senior LinkedIn ghostwriter. Ask me for the topic, audience, evidence, and desired tone. Produce 5 hooks, 1 polished post, 3 CTA variants, and a short revision checklist.",
        category: "Marketing",
        tags: ["linkedin", "content", "personal-branding", "writing"],
      },
      {
        title: "Newsletter Growth Angle Finder",
        slug: "newsletter-growth-angle-finder",
        description: "Generate distinct growth angles and subject lines for a weekly newsletter issue.",
        content: "Act as a growth editor. Ask for audience, issue goal, and current CTR/open rates. Suggest 10 growth angles, 12 subject lines, and a concrete send-plan for A/B testing.",
        category: "Marketing",
        tags: ["newsletter", "growth", "copywriting", "distribution"],
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
        description: "Clarify your SaaS positioning with customer segment, alternatives, and proof points.",
        content: "Act as a SaaS positioning consultant. Interview me on segment, alternatives, pain, and evidence. Return a positioning statement, headline options, objection handling, and launch narrative.",
        category: "Business",
        tags: ["saas", "positioning", "product-marketing", "strategy"],
      },
      {
        title: "Feature Prioritization Council",
        slug: "feature-prioritization-council",
        description: "Rank roadmap ideas using impact, effort, confidence, and strategic fit.",
        content: "Act as product triage council with PM, design, and engineering lenses. Score each feature across ICE and strategic fit, then produce top-5 with rationale and sequencing risks.",
        category: "Business",
        tags: ["roadmap", "prioritization", "product", "strategy"],
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
        description: "Convert interface notes into a structured UX audit with severity and recommendations.",
        content: "Act as a principal UX auditor. Review screen/workflow context and list usability issues by severity, user impact, and implementation-ready fix recommendations.",
        category: "Design",
        tags: ["ux", "audit", "design-systems", "product"],
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
        description: "Analyze bug reports and logs into a triage plan with likely causes and rollback criteria.",
        content: "Act as a staff engineer in incident mode. Ask for symptoms, logs, deploy timeline, and user impact. Return probable causes, investigation order, rollback triggers, and mitigation plan.",
        category: "Coding",
        tags: ["debugging", "incident-response", "backend", "engineering"],
      },
      {
        title: "Code Review Mentor",
        slug: "code-review-mentor",
        description: "Get a constructive code review checklist tailored to a PR and architecture constraints.",
        content: "Act as a senior reviewer. Ask for PR summary, architecture context, and risk areas. Return review comments grouped by correctness, maintainability, performance, and security.",
        category: "Coding",
        tags: ["code-review", "engineering", "quality", "architecture"],
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
        description: "Turn process notes into a reusable SOP with handoffs, quality checks, and escalation paths.",
        content: "Act as an operations lead. Ask for process goal, owner, tools, risks, and quality bar. Produce an SOP, checklist, roles map, and continuous-improvement recommendations.",
        category: "Productivity",
        tags: ["operations", "sop", "process", "productivity"],
      },
    ],
  },
];

const users = [
  { name: "Ethan Cole", email: "ethan.cole@promptx.local", favoriteTags: ["coding", "backend", "debugging"] },
  { name: "Maya Patel", email: "maya.patel@promptx.local", favoriteTags: ["marketing", "copywriting", "brand"] },
  { name: "Jordan Lee", email: "jordan.lee@promptx.local", favoriteTags: ["product", "ux", "research"] },
  { name: "Priya Nair", email: "priya.nair@promptx.local", favoriteTags: ["operations", "management", "sop"] },
  { name: "Lucas Hart", email: "lucas.hart@promptx.local", favoriteTags: ["automation", "productivity", "saas"] },
  { name: "Noah Kim", email: "noah.kim@promptx.local", favoriteTags: ["startup", "strategy", "growth"] },
];

const reviewComments = [
  "Used this in a live client workflow. The structure is clear and saved me at least an hour.",
  "Strong framework with practical prompts. I only tweaked the tone section for my audience.",
  "Very actionable output. It gave me a clean first draft and reduced editing cycles.",
  "High quality prompt. I'd love a second version specialized for B2B technical audiences.",
  "Useful and reliable. It asks the right context questions before generating output.",
  "Good baseline template and easy to adapt. Works especially well for repeatable tasks.",
];

function scoreFor(index) {
  const clarity = 84 + (index % 9);
  const creativity = 78 + ((index * 3) % 15);
  const relevance = 86 + ((index * 5) % 11);
  const overall = Math.round((clarity + creativity + relevance) / 3);
  return { clarity, creativity, relevance, overall };
}

function makeRankingMetrics(promptIndex, ratingAverage, ratingCount, reviewCount, favoriteCount, likeCount) {
  const views = 1100 + promptIndex * 410 + ratingCount * 16;
  const engagementScore = Math.round((favoriteCount * 1.7) + (likeCount * 1.25) + (reviewCount * 4.2));
  const rankingScore = Math.round((ratingAverage * 100) + (ratingCount * 2.4) + engagementScore * 0.8 + views * 0.03);
  return { views, engagementScore, rankingScore };
}

async function resetCollections() {
  await Promise.all([
    UserActivity.deleteMany({}),
    Review.deleteMany({}),
    Like.deleteMany({}),
    Favorite.deleteMany({}),
    Prompt.deleteMany({}),
    User.deleteMany({ email: /@promptx\.local$/i }),
  ]);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);

  if (SHOULD_RESET) {
    await resetCollections();
  }

  const passwordHash = await User.hashPassword(DEFAULT_PASSWORD);
  const creatorDocs = [];

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
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    creatorDocs.push({ ...creator, user });
  }

  const memberDocs = [];
  for (const member of users) {
    const user = await User.findOneAndUpdate(
      { email: member.email },
      {
        name: member.name,
        email: member.email,
        passwordHash,
        bio: "PromptX community member exploring practical AI workflows for daily work.",
        favoriteTags: member.favoriteTags,
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    memberDocs.push(user);
  }

  const promptDocs = [];
  let promptIndex = 0;

  for (const creator of creatorDocs) {
    for (const prompt of creator.prompts) {
      const ratingCount = 22 + (promptIndex % 5) * 7;
      const reviewCount = 10 + (promptIndex % 4) * 3;
      const favoriteCount = 30 + (promptIndex % 6) * 11;
      const likeCount = 48 + (promptIndex % 6) * 15;
      const ratingAverage = Number((4.4 + (promptIndex % 5) * 0.1).toFixed(1));
      const aiScore = scoreFor(promptIndex);
      const metrics = makeRankingMetrics(
        promptIndex,
        ratingAverage,
        ratingCount,
        reviewCount,
        favoriteCount,
        likeCount
      );

      const promptDoc = await Prompt.findOneAndUpdate(
        { slug: prompt.slug },
        {
          ...prompt,
          author: creator.user._id,
          status: PROMPT_STATUS.PUBLISHED,
          evaluationStatus: EVALUATION_STATUS.COMPLETED,
          evaluationSummary: "Seeded demo prompt with clear scope, practical structure, and strong user intent alignment.",
          evaluationSource: "seed",
          aiScore,
          ratingAverage,
          ratingCount,
          reviewCount,
          favoriteCount,
          likeCount,
          ...metrics,
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );

      promptDocs.push(promptDoc);
      promptIndex += 1;
    }
  }

  const reviews = [];
  const likes = [];
  const favorites = [];
  const activities = [];

  promptDocs.forEach((promptDoc, index) => {
    const reviewerPool = [...memberDocs, creatorDocs[(index + 1) % creatorDocs.length].user];

    reviewerPool.slice(0, Math.min(4, reviewerPool.length)).forEach((reviewer, reviewerIndex) => {
      const rating = 4 + ((index + reviewerIndex) % 2);
      reviews.push({
        user: reviewer._id,
        prompt: promptDoc._id,
        rating,
        comment: reviewComments[(index + reviewerIndex) % reviewComments.length],
      });

      activities.push(
        {
          user: reviewer._id,
          prompt: promptDoc._id,
          type: ACTIVITY_TYPES.REVIEW,
          tagsSnapshot: promptDoc.tags,
          categorySnapshot: promptDoc.category,
        },
        {
          user: reviewer._id,
          prompt: promptDoc._id,
          type: ACTIVITY_TYPES.VIEW,
          tagsSnapshot: promptDoc.tags,
          categorySnapshot: promptDoc.category,
        }
      );
    });

    memberDocs.forEach((member, memberIndex) => {
      if ((index + memberIndex) % 2 === 0) {
        likes.push({ user: member._id, prompt: promptDoc._id });
        activities.push({
          user: member._id,
          prompt: promptDoc._id,
          type: ACTIVITY_TYPES.LIKE,
          tagsSnapshot: promptDoc.tags,
          categorySnapshot: promptDoc.category,
        });
      }

      if ((index + memberIndex) % 3 === 0) {
        favorites.push({ user: member._id, prompt: promptDoc._id });
        activities.push({
          user: member._id,
          prompt: promptDoc._id,
          type: ACTIVITY_TYPES.FAVORITE,
          tagsSnapshot: promptDoc.tags,
          categorySnapshot: promptDoc.category,
        });
      }
    });
  });

  if (reviews.length) {
    await Review.insertMany(reviews, { ordered: false });
  }
  if (likes.length) {
    await Like.insertMany(likes, { ordered: false });
  }
  if (favorites.length) {
    await Favorite.insertMany(favorites, { ordered: false });
  }
  if (activities.length) {
    await UserActivity.insertMany(activities, { ordered: false });
  }

  console.log(`Seed complete:`);
  console.log(`- Creators: ${creatorDocs.length}`);
  console.log(`- Members: ${memberDocs.length}`);
  console.log(`- Prompts: ${promptDocs.length}`);
  console.log(`- Reviews: ${reviews.length}`);
  console.log(`- Likes: ${likes.length}`);
  console.log(`- Favorites: ${favorites.length}`);
  console.log(`- Activities: ${activities.length}`);
  console.log(`Default password for all seeded users: ${DEFAULT_PASSWORD}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
