import { Lightbulb, Tag, TrendingUp, Zap } from "lucide-react";

interface StageProps {
  formData: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    campaignGoal: string;
    industry: string;
    timeline: string;
  };
}

const IDEA_PLACEHOLDERS = [
  {
    icon: Zap,
    badge: "Hero Campaign",
    color: "primary",
    title: "Awareness-First Launch",
    tagline: "Make your mark before you ask for the sale.",
    description:
      "A multi-touchpoint campaign that introduces your brand story across social and display before pushing conversion. Build recognition first — then convert warm audiences.",
    tactics: ["Storytelling video ads", "Influencer seeding", "Organic social content", "Retargeting funnel"],
  },
  {
    icon: TrendingUp,
    badge: "Performance",
    color: "accent",
    title: "Direct Response Drive",
    tagline: "Clicks that count. Conversions that close.",
    description:
      "Precision-targeted performance ads designed around a specific high-intent action — sign-up, purchase, or demo request. Every dollar earns its place.",
    tactics: ["Search ads", "Shopping campaigns", "Landing page optimization", "Email nurture"],
  },
  {
    icon: Tag,
    badge: "Community",
    color: "chart-4",
    title: "Social Proof Engine",
    tagline: "Let your customers do the talking.",
    description:
      "Leverage UGC, reviews, and customer stories to build trust at scale. Combine community content with paid amplification to create a credibility flywheel.",
    tactics: ["UGC collection campaign", "Review amplification", "Creator partnerships", "Referral program"],
  },
];

export default function CampaignIdeasStage({ formData }: StageProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Campaign Ideas</h3>
          <p className="text-muted-foreground text-sm">
            3 tailored concepts for <span className="text-foreground font-medium">{formData.productName}</span>
          </p>
        </div>
      </div>

      {/* Context chips */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
        <span className="text-xs text-muted-foreground font-medium mr-1">Brief:</span>
        {[
          { label: "Goal", value: formData.campaignGoal.replace(/-/g, " ") },
          { label: "Industry", value: formData.industry },
          { label: "Timeline", value: formData.timeline.replace(/-/g, " ") },
        ].map((chip) => (
          <span key={chip.label} className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-foreground">
            <span className="text-muted-foreground">{chip.label}:</span> {chip.value}
          </span>
        ))}
      </div>

      <div className="grid gap-4" data-testid="campaign-ideas-list">
        {IDEA_PLACEHOLDERS.map((idea, idx) => {
          const Icon = idea.icon;
          return (
            <div
              key={idx}
              data-testid={`campaign-idea-${idx}`}
              className="group p-5 rounded-xl border border-border bg-background/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {idea.badge}
                    </span>
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-base mb-1">{idea.title}</h4>
                  <p className="text-accent text-sm font-medium italic mb-2">"{idea.tagline}"</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{idea.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tactics.map((tactic) => (
                      <span key={tactic} className="px-2 py-0.5 rounded-md text-xs bg-muted/50 border border-border text-muted-foreground">
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">Stage 1 of 4 complete.</span> These campaign concepts are tailored to your{" "}
          <span className="text-foreground">{formData.campaignGoal.replace(/-/g, " ")}</span> goal. Proceed to{" "}
          <span className="text-foreground font-medium">Stage 2</span> to generate specific ad copies for each concept.
        </p>
      </div>
    </div>
  );
}
