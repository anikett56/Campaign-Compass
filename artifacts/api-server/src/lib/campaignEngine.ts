/**
 * Campaign Smart Logic Engine
 * Rule-based generation with priority assignment, effort estimation,
 * risk detection, and scoring/classification.
 */

import { logger } from "./logger";

export interface CampaignInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  audienceAge: string;
  audienceLocation: string;
  budget: string;
  customBudget?: string | null;
  campaignGoal: string;
  timeline: string;
  industry: string;
}

export interface CampaignItem {
  id: string;
  type: "campaign_idea" | "ad_copy" | "channel" | "ab_test";
  title: string;
  description: string;
  content: Record<string, unknown>;
  priority: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  score: number;
}

export interface CampaignInsight {
  type: "tip" | "warning" | "opportunity" | "risk";
  message: string;
}

export interface ChannelAllocation {
  channel: string;
  percentage: number;
  estimatedMonthlySpend: string;
  priority: "High" | "Medium" | "Low";
}

export interface CampaignMetadata {
  priority: "High" | "Medium" | "Low";
  risk: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  overallScore: number;
  classification: string;
  budgetTier: string;
  goalAlignment: number;
}

export interface CampaignResult {
  summary: string;
  items: CampaignItem[];
  insights: CampaignInsight[];
  channelAllocation: ChannelAllocation[];
  metadata: CampaignMetadata;
  generatedAt: string;
}

// ── Budget scoring ──────────────────────────────────────────────────────────

const BUDGET_SCORE_MAP: Record<string, number> = {
  "under-10k": 1,
  "10k-50k": 2,
  "50k-1l": 3,
  "1l-5l": 4,
  "5l-10l": 5,
  "10l+": 6,
  custom: 4,
};

const BUDGET_LABEL_MAP: Record<string, string> = {
  "under-10k": "Starter (< ₹10K)",
  "10k-50k": "Growth (₹10K–₹50K)",
  "50k-1l": "Scale (₹50K–₹1L)",
  "1l-5l": "Performance (₹1L–₹5L)",
  "5l-10l": "Enterprise (₹5L–₹10L)",
  "10l+": "Premium (₹10L+)",
  custom: "Custom Budget",
};

// ── Goal configurations ──────────────────────────────────────────────────────

interface GoalConfig {
  primaryChannels: string[];
  riskLevel: "High" | "Medium" | "Low";
  effortLevel: "High" | "Medium" | "Low";
  goalAlignment: number;
}

const GOAL_CONFIG: Record<string, GoalConfig> = {
  awareness: {
    primaryChannels: ["Paid Social", "Display Ads", "Influencer"],
    riskLevel: "Low",
    effortLevel: "Medium",
    goalAlignment: 85,
  },
  leads: {
    primaryChannels: ["Search / SEM", "Paid Social", "Email"],
    riskLevel: "Medium",
    effortLevel: "High",
    goalAlignment: 90,
  },
  conversions: {
    primaryChannels: ["Search / SEM", "Retargeting", "Email"],
    riskLevel: "Medium",
    effortLevel: "High",
    goalAlignment: 92,
  },
  retention: {
    primaryChannels: ["Email", "Push Notifications", "Loyalty Programs"],
    riskLevel: "Low",
    effortLevel: "Medium",
    goalAlignment: 88,
  },
  engagement: {
    primaryChannels: ["Paid Social", "Influencer", "Content / SEO"],
    riskLevel: "Low",
    effortLevel: "Medium",
    goalAlignment: 80,
  },
  launch: {
    primaryChannels: ["Paid Social", "PR / Influencer", "Search / SEM"],
    riskLevel: "High",
    effortLevel: "High",
    goalAlignment: 95,
  },
  "app-installs": {
    primaryChannels: ["App Store Ads", "Paid Social", "Search / SEM"],
    riskLevel: "Medium",
    effortLevel: "High",
    goalAlignment: 88,
  },
};

// ── Industry configurations ──────────────────────────────────────────────────

const HIGH_COMPETITION_INDUSTRIES = ["beauty", "fashion", "tech", "ecommerce", "finance"];
const HIGH_TRUST_INDUSTRIES = ["health", "finance", "real-estate"];

// ── Scoring utility ──────────────────────────────────────────────────────────

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function assignPriority(score: number): "High" | "Medium" | "Low" {
  if (score >= 75) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

function assignEffort(budgetScore: number, goal: string): "High" | "Medium" | "Low" {
  const goalConfig = GOAL_CONFIG[goal];
  if (goalConfig?.effortLevel === "High" || budgetScore >= 4) return "High";
  if (budgetScore >= 2) return "Medium";
  return "Low";
}

// ── Campaign idea generator ──────────────────────────────────────────────────

function generateCampaignIdeas(input: CampaignInput, budgetScore: number): CampaignItem[] {
  const { productName, industry, campaignGoal, targetAudience, timeline } = input;
  const isHighCompetition = HIGH_COMPETITION_INDUSTRIES.includes(industry);
  const needsTrust = HIGH_TRUST_INDUSTRIES.includes(industry);

  const ideas: Array<Omit<CampaignItem, "priority" | "effort" | "score"> & { rawScore: number }> = [
    {
      id: "idea-1",
      type: "campaign_idea",
      title: `${productName} Brand Storytelling Push`,
      description: `A narrative-driven campaign that tells the origin story of ${productName} and emotionally connects with ${targetAudience}.`,
      content: {
        angle: "Emotional storytelling",
        format: "Video series + carousel",
        duration: timeline,
        keyMessage: `Why ${productName} exists and why it matters to you`,
        tactics: ["Hero video ad", "Founder story reel", "Customer testimonials", "Retargeting funnel"],
      },
      rawScore: clamp(60 + budgetScore * 5 + (isHighCompetition ? -10 : 5)),
    },
    {
      id: "idea-2",
      type: "campaign_idea",
      title: `${campaignGoal.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Blitz`,
      description: `A focused, goal-aligned campaign engineered specifically to drive ${campaignGoal.replace(/-/g, " ")} outcomes within ${timeline.replace(/-/g, " ")}.`,
      content: {
        angle: "Direct response + performance",
        format: "Search ads + landing page",
        duration: timeline,
        keyMessage: `Get [desired result] with ${productName} — start today`,
        tactics: ["Search campaigns", "Landing page A/B test", "Email drip sequence", "Conversion tracking"],
      },
      rawScore: clamp(70 + budgetScore * 4 + (needsTrust ? 5 : 0)),
    },
    {
      id: "idea-3",
      type: "campaign_idea",
      title: `Social Proof & UGC Engine`,
      description: `Leverage existing customers and creators to build a credibility flywheel for ${productName}, especially powerful for ${industry} sector.`,
      content: {
        angle: "Trust + social proof",
        format: "UGC + influencer seeding",
        duration: timeline,
        keyMessage: `Real people, real results with ${productName}`,
        tactics: ["UGC collection drive", "Micro-influencer outreach", "Review amplification", "Community hashtag"],
      },
      rawScore: clamp(55 + budgetScore * 3 + (needsTrust ? 15 : 0) + (isHighCompetition ? 10 : 0)),
    },
  ];

  return ideas.map((idea) => ({
    ...idea,
    score: Math.round(idea.rawScore),
    priority: assignPriority(idea.rawScore),
    effort: assignEffort(budgetScore, campaignGoal),
  }));
}

// ── Ad copy generator ──────────────────────────────────────────────────────

function generateAdCopies(input: CampaignInput, budgetScore: number): CampaignItem[] {
  const { productName, targetAudience, campaignGoal } = input;

  const copies: Array<Omit<CampaignItem, "priority" | "effort" | "score"> & { rawScore: number }> = [
    {
      id: "copy-1",
      type: "ad_copy",
      title: "Hook-First Social Ad",
      description: "Scroll-stopping opener designed for social feeds with high thumb-stop rate.",
      content: {
        platform: "Instagram / Facebook",
        format: "Single image or Reel",
        headline: `Stop. This is for ${targetAudience.split(" ").slice(0, 4).join(" ")}.`,
        body: `Tired of the same old solutions? ${productName} was built differently — and the results show. Join thousands who already made the switch.`,
        cta: "See How It Works →",
        toneTag: "Disruptive + Curious",
      },
      rawScore: clamp(65 + budgetScore * 3),
    },
    {
      id: "copy-2",
      type: "ad_copy",
      title: "Problem-Solution Search Ad",
      description: "High-intent search ad targeting buyers actively looking for solutions.",
      content: {
        platform: "Google Search",
        format: "Responsive search ad",
        headline: `Best ${productName} in India — Trusted by Thousands`,
        body: `Looking for real results? ${productName} delivers. No fluff, no filler. Free delivery. Try risk-free today.`,
        cta: "Shop Now",
        toneTag: "Confident + Trustworthy",
      },
      rawScore: clamp(75 + (campaignGoal === "conversions" ? 10 : 0) + budgetScore * 2),
    },
    {
      id: "copy-3",
      type: "ad_copy",
      title: "Urgency-Driven Offer Ad",
      description: "Conversion-focused copy with time pressure and clear value proposition.",
      content: {
        platform: "Meta + Google Display",
        format: "Banner / Carousel",
        headline: `Limited Offer: ${productName} at Lowest Price`,
        body: `Only available this week. 50,000+ happy customers can't be wrong. Grab yours before stock runs out.`,
        cta: "Claim Offer — Ends Sunday",
        toneTag: "Urgent + Social Proof",
      },
      rawScore: clamp(70 + (campaignGoal === "leads" ? 8 : 0) + budgetScore * 2),
    },
    {
      id: "copy-4",
      type: "ad_copy",
      title: "Email Subject Line Set",
      description: "High open-rate subject lines for your email marketing campaigns.",
      content: {
        platform: "Email",
        format: "Subject lines (3 variants)",
        variants: [
          `We probably shouldn't tell you this about ${productName}...`,
          `⏰ Last chance — this offer for ${targetAudience.split(" ")[0]} expires tonight`,
          `Why everyone in ${input.audienceLocation.split(",")[0]} is switching to ${productName}`,
        ],
        toneTag: "Curiosity + Urgency + Social Proof",
      },
      rawScore: clamp(68 + budgetScore * 2),
    },
  ];

  return copies.map((copy) => ({
    ...copy,
    score: Math.round(copy.rawScore),
    priority: assignPriority(copy.rawScore),
    effort: "Low" as const,
  }));
}

// ── A/B test generator ──────────────────────────────────────────────────────

function generateABTests(input: CampaignInput, budgetScore: number): CampaignItem[] {
  const { productName, campaignGoal } = input;

  const tests: Array<Omit<CampaignItem, "priority" | "effort" | "score"> & { rawScore: number }> = [
    {
      id: "ab-1",
      type: "ab_test",
      title: "Creative Format Test — Video vs Static",
      description: "Determine whether video or static image drives higher engagement and CTR on paid social.",
      content: {
        channel: "Meta Ads",
        hypothesis: "Video creative will outperform static image in CTR by at least 30%.",
        variantA: { label: "Control — Static carousel", metric: "CTR", target: "2.5%" },
        variantB: { label: "Challenger — 15s UGC video", metric: "CTR", target: "4.0%+" },
        sampleSize: "10,000 impressions each",
        duration: "14 days",
        significance: "95%",
        estimatedLift: "30-60%",
      },
      rawScore: clamp(80 + budgetScore * 2),
    },
    {
      id: "ab-2",
      type: "ab_test",
      title: "Headline Angle — Benefit vs Feature",
      description: "Test whether benefit-focused messaging converts better than feature-focused in search ads.",
      content: {
        channel: "Google Search",
        hypothesis: "Benefit headlines convert 40% better than feature headlines.",
        variantA: { label: "Control — Feature headline", metric: "CVR", target: "3.2%" },
        variantB: { label: "Challenger — Benefit headline", metric: "CVR", target: "5.0%+" },
        sampleSize: "500 clicks each",
        duration: "21 days",
        significance: "95%",
        estimatedLift: "40-55%",
      },
      rawScore: clamp(78 + (campaignGoal === "conversions" ? 10 : 0) + budgetScore),
    },
    {
      id: "ab-3",
      type: "ab_test",
      title: "CTA Button Copy Test",
      description: `Determine the highest-converting call-to-action copy for ${productName}'s landing page.`,
      content: {
        channel: "Landing Page",
        hypothesis: "Descriptive CTAs outperform generic ones by 20-35%.",
        variantA: { label: "Control — 'Get Started'", metric: "CVR", target: "3.5%" },
        variantB: { label: "Challenger — 'Start Free — No Card Needed'", metric: "CVR", target: "5.0%+" },
        sampleSize: "1,000 visitors each",
        duration: "7 days",
        significance: "95%",
        estimatedLift: "20-35%",
      },
      rawScore: clamp(72 + budgetScore * 2),
    },
  ];

  return tests.map((test) => ({
    ...test,
    score: Math.round(test.rawScore),
    priority: assignPriority(test.rawScore),
    effort: assignEffort(budgetScore, campaignGoal),
  }));
}

// ── Channel allocation ──────────────────────────────────────────────────────

function generateChannelAllocation(input: CampaignInput, budgetScore: number): ChannelAllocation[] {
  const { campaignGoal, budget, customBudget } = input;
  const goalConfig = GOAL_CONFIG[campaignGoal] ?? GOAL_CONFIG["awareness"];

  // Base allocation by goal type
  const allocationMap: Record<string, Record<string, number>> = {
    awareness: { "Paid Social": 40, "Display Ads": 25, "Influencer": 20, "Content / SEO": 10, "Email": 5 },
    leads: { "Search / SEM": 35, "Paid Social": 30, "Email": 20, "Display Ads": 10, "Content / SEO": 5 },
    conversions: { "Search / SEM": 40, "Retargeting": 25, "Paid Social": 20, "Email": 10, "Display Ads": 5 },
    retention: { "Email": 40, "Paid Social": 25, "Push Notifications": 20, "Content / SEO": 10, "Display Ads": 5 },
    engagement: { "Paid Social": 45, "Influencer": 25, "Content / SEO": 20, "Email": 7, "Display Ads": 3 },
    launch: { "Paid Social": 35, "Influencer": 25, "Search / SEM": 20, "PR": 15, "Email": 5 },
    "app-installs": { "App Store Ads": 35, "Paid Social": 30, "Search / SEM": 20, "Display Ads": 10, "Email": 5 },
  };

  const alloc = allocationMap[campaignGoal] ?? allocationMap["awareness"];

  // Estimate monthly spend from budget key
  const monthlyBudget = estimateMonthlyBudget(budget, customBudget);

  return Object.entries(alloc).map(([channel, pct]) => {
    const spend = Math.round((pct / 100) * monthlyBudget);
    const isTopChannel = goalConfig.primaryChannels.some((c) => channel.includes(c.split(" / ")[0]));
    return {
      channel,
      percentage: pct,
      estimatedMonthlySpend: formatCurrency(spend),
      priority: isTopChannel && pct >= 25 ? "High" : pct >= 15 ? "Medium" : "Low",
    };
  });
}

function estimateMonthlyBudget(budget: string, customBudget?: string | null): number {
  if (budget === "custom" && customBudget) {
    const num = parseInt(customBudget.replace(/[^\d]/g, ""), 10);
    return isNaN(num) ? 100000 : num;
  }
  const budgetMidpoints: Record<string, number> = {
    "under-10k": 7000,
    "10k-50k": 30000,
    "50k-1l": 75000,
    "1l-5l": 300000,
    "5l-10l": 750000,
    "10l+": 1500000,
  };
  return budgetMidpoints[budget] ?? 100000;
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

// ── Risk detection ──────────────────────────────────────────────────────────

function detectRisk(input: CampaignInput, budgetScore: number): "High" | "Medium" | "Low" {
  const risks: number[] = [];

  if (budgetScore <= 1) risks.push(3); // very low budget
  if (HIGH_COMPETITION_INDUSTRIES.includes(input.industry)) risks.push(2);
  if (input.timeline === "1-week" || input.timeline === "2-weeks") risks.push(2);
  if (input.campaignGoal === "launch") risks.push(2);
  if (budgetScore >= 4 && !HIGH_COMPETITION_INDUSTRIES.includes(input.industry)) risks.push(-1);

  const total = risks.reduce((a, b) => a + b, 0);
  if (total >= 5) return "High";
  if (total >= 2) return "Medium";
  return "Low";
}

// ── Insight generator ──────────────────────────────────────────────────────

function generateInsights(input: CampaignInput, budgetScore: number, risk: "High" | "Medium" | "Low"): CampaignInsight[] {
  const insights: CampaignInsight[] = [];
  const { industry, campaignGoal, timeline, audienceAge, budget } = input;

  // Budget insights
  if (budgetScore <= 1) {
    insights.push({
      type: "warning",
      message: `Your budget is in the starter tier. Focus on 1-2 channels max to avoid spreading spend too thin. Email and organic social are free alternatives.`,
    });
  } else if (budgetScore >= 5) {
    insights.push({
      type: "opportunity",
      message: `With your budget, you can run multi-channel campaigns simultaneously and afford brand safety tools, creative testing, and media buying at scale.`,
    });
  }

  // Risk insights
  if (risk === "High") {
    insights.push({
      type: "risk",
      message: `Risk level is HIGH. Key factors: competitive industry, short timeline, and/or ambitious goal. Ensure you have contingency budget (15–20%) and clear KPI checkpoints.`,
    });
  }

  // Goal-specific insights
  if (campaignGoal === "launch") {
    insights.push({
      type: "tip",
      message: `Product launches need a 2-week pre-launch warm-up phase. Build an email waitlist and run teaser social content before the main campaign goes live.`,
    });
  }

  if (campaignGoal === "conversions" || campaignGoal === "leads") {
    insights.push({
      type: "tip",
      message: `For ${campaignGoal}, ensure your landing page is conversion-optimized. A 1-second load time improvement can increase conversions by up to 7%.`,
    });
  }

  // Audience insights
  const youngAges = ["13-17", "18-24", "25-34"];
  const olderAges = ["45-54", "55-64", "65+"];
  if (youngAges.includes(audienceAge)) {
    insights.push({
      type: "opportunity",
      message: `Your audience skews young (${audienceAge}). Prioritize short-form video (Instagram Reels, YouTube Shorts, TikTok) — these formats have 2–3x higher engagement for this demographic.`,
    });
  } else if (olderAges.includes(audienceAge)) {
    insights.push({
      type: "tip",
      message: `Older demographics (${audienceAge}) respond better to Facebook, Google Search, and email. Avoid heavy slang and prioritize trust signals like reviews and guarantees.`,
    });
  }

  // Industry-specific
  if (HIGH_TRUST_INDUSTRIES.includes(industry)) {
    insights.push({
      type: "tip",
      message: `In ${industry}, trust is the #1 conversion driver. Lead with certifications, testimonials, and guarantees before pushing price or features.`,
    });
  }

  if (HIGH_COMPETITION_INDUSTRIES.includes(industry)) {
    insights.push({
      type: "warning",
      message: `The ${industry} industry is highly competitive. Differentiation is critical — identify your unique angle before running ads or you'll burn budget on low-quality traffic.`,
    });
  }

  // Timeline
  if (timeline === "1-week" || timeline === "2-weeks") {
    insights.push({
      type: "warning",
      message: `Short timelines limit learning cycles. Algorithms need 7–14 days of data to exit the learning phase. Consider extending to 1 month for better optimization.`,
    });
  }

  return insights.slice(0, 5); // Cap at 5 insights
}

// ── Overall classification ──────────────────────────────────────────────────

function classifyCampaign(input: CampaignInput, budgetScore: number): string {
  const { campaignGoal, timeline } = input;

  if (campaignGoal === "launch") return "Launch Campaign";
  if (campaignGoal === "awareness" && budgetScore >= 4) return "Brand Building Campaign";
  if (campaignGoal === "conversions" && budgetScore >= 3) return "Performance-First Campaign";
  if (campaignGoal === "retention") return "Retention & LTV Campaign";
  if (campaignGoal === "leads" && timeline === "1-month") return "Lead Generation Sprint";
  if (budgetScore <= 2) return "Lean Growth Campaign";
  return "Integrated Multi-Channel Campaign";
}

// ── Main engine ──────────────────────────────────────────────────────────────

export function generateCampaign(input: CampaignInput): CampaignResult {
  logger.info({ productName: input.productName, goal: input.campaignGoal, industry: input.industry }, "Campaign engine processing input");

  const budgetScore = BUDGET_SCORE_MAP[input.budget] ?? 3;
  const goalConfig = GOAL_CONFIG[input.campaignGoal] ?? GOAL_CONFIG["awareness"];

  // Generate items
  const ideas = generateCampaignIdeas(input, budgetScore);
  const copies = generateAdCopies(input, budgetScore);
  const tests = generateABTests(input, budgetScore);
  const allItems = [...ideas, ...copies, ...tests];

  // Compute metadata
  const risk = detectRisk(input, budgetScore);
  const overallScore = Math.round(
    allItems.reduce((sum, item) => sum + item.score, 0) / allItems.length
  );
  const effort = goalConfig.effortLevel;
  const priority = assignPriority(overallScore);

  const metadata: CampaignMetadata = {
    priority,
    risk,
    effort,
    overallScore,
    classification: classifyCampaign(input, budgetScore),
    budgetTier: BUDGET_LABEL_MAP[input.budget] ?? "Custom",
    goalAlignment: goalConfig.goalAlignment,
  };

  // Generate insights
  const insights = generateInsights(input, budgetScore, risk);

  // Channel allocation
  const channelAllocation = generateChannelAllocation(input, budgetScore);

  // Summary
  const summary =
    `${metadata.classification} for ${input.productName} targeting ${input.targetAudience} ` +
    `in the ${input.industry} sector. Budget tier: ${metadata.budgetTier}. ` +
    `Overall readiness score: ${overallScore}/100. Risk level: ${risk}. ` +
    `Goal alignment: ${metadata.goalAlignment}%. Focus channels: ${goalConfig.primaryChannels.join(", ")}.`;

  const result: CampaignResult = {
    summary,
    items: allItems,
    insights,
    channelAllocation,
    metadata,
    generatedAt: new Date().toISOString(),
  };

  logger.info(
    { overallScore, risk, priority, itemCount: allItems.length, insightCount: insights.length },
    "Campaign engine output ready"
  );

  return result;
}
