import { BarChart2, TrendingUp, Users, DollarSign } from "lucide-react";

interface StageProps {
  formData: {
    productName: string;
    budget: string;
    customBudget?: string;
    targetAudience: string;
    audienceAge: string;
    campaignGoal: string;
    industry: string;
  };
}

const CHANNELS = [
  {
    name: "Paid Social",
    platforms: "Meta (Facebook/Instagram), TikTok",
    allocation: 35,
    color: "hsl(252 87% 67%)",
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    kpis: ["CPM", "CTR", "ROAS"],
    rationale: "Highest reach for awareness + retargeting capabilities for conversion. Best for visual products and lifestyle brands.",
    recommended: true,
  },
  {
    name: "Search / SEM",
    platforms: "Google Ads, Bing Ads",
    allocation: 30,
    color: "hsl(198 93% 60%)",
    bg: "bg-accent/10",
    border: "border-accent/20",
    text: "text-accent",
    kpis: ["CPC", "Quality Score", "Conversion Rate"],
    rationale: "Captures high-intent buyers actively searching. Essential for direct response and performance campaigns.",
    recommended: true,
  },
  {
    name: "Influencer / Creator",
    platforms: "Instagram, YouTube, TikTok creators",
    allocation: 20,
    color: "hsl(37 91% 55%)",
    bg: "bg-chart-4/10",
    border: "border-chart-4/20",
    text: "text-chart-4",
    kpis: ["EMV", "Reach", "Engagement Rate"],
    rationale: "Builds social proof and trust. Especially effective for new brands and products targeting younger demographics.",
    recommended: false,
  },
  {
    name: "Email Marketing",
    platforms: "Klaviyo, Mailchimp, HubSpot",
    allocation: 10,
    color: "hsl(160 84% 39%)",
    bg: "bg-chart-3/10",
    border: "border-chart-3/20",
    text: "text-chart-3",
    kpis: ["Open Rate", "CTR", "Revenue per Email"],
    rationale: "Highest ROI channel for retention and nurture. Low cost, owned audience, essential for LTV growth.",
    recommended: false,
  },
  {
    name: "Content / SEO",
    platforms: "Blog, YouTube, Podcast",
    allocation: 5,
    color: "hsl(340 82% 62%)",
    bg: "bg-chart-5/10",
    border: "border-chart-5/20",
    text: "text-chart-5",
    kpis: ["Organic Traffic", "Keyword Rankings", "Backlinks"],
    rationale: "Long-term compounding returns. Reduces CAC over time as organic traffic grows. Best for SaaS and info products.",
    recommended: false,
  },
];

function getBudgetLabel(budget: string, custom?: string) {
  if (budget === "custom") return custom || "Custom";
  const map: Record<string, string> = {
    "under-1k": "< $1,000/mo",
    "1k-5k": "$1k–$5k/mo",
    "5k-10k": "$5k–$10k/mo",
    "10k-50k": "$10k–$50k/mo",
    "50k-100k": "$50k–$100k/mo",
    "100k+": "$100k+/mo",
  };
  return map[budget] || budget;
}

export default function ChannelMixStage({ formData }: StageProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-chart-3/20 border border-chart-3/30 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-chart-3" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Channel Mix & Budget Allocation</h3>
          <p className="text-muted-foreground text-sm">
            Recommended distribution for a <span className="text-foreground font-medium">{getBudgetLabel(formData.budget, formData.customBudget)}</span> budget
          </p>
        </div>
      </div>

      {/* Visual allocation bar */}
      <div className="mb-6 p-5 bg-background/50 rounded-xl border border-border">
        <p className="text-xs text-muted-foreground font-medium mb-3">Budget Distribution</p>
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5" data-testid="budget-bar">
          {CHANNELS.map((ch, idx) => (
            <div
              key={idx}
              data-testid={`budget-bar-segment-${idx}`}
              style={{ width: `${ch.allocation}%`, backgroundColor: ch.color }}
              title={`${ch.name}: ${ch.allocation}%`}
              className="rounded-sm first:rounded-l-full last:rounded-r-full transition-all"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {CHANNELS.map((ch, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ch.color }} />
              <span className="text-xs text-muted-foreground">{ch.name} <span className="text-foreground font-medium">{ch.allocation}%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel cards */}
      <div className="space-y-3" data-testid="channel-list">
        {CHANNELS.map((channel, idx) => (
          <div
            key={idx}
            data-testid={`channel-card-${idx}`}
            className={`p-4 rounded-xl border ${channel.border} ${channel.bg} hover:scale-[1.005] transition-transform`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${channel.text}`}>{channel.name}</h4>
                  {channel.recommended && (
                    <span className="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                      Top Pick
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{channel.platforms}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{channel.rationale}</p>
                <div className="flex flex-wrap gap-1.5">
                  {channel.kpis.map((kpi) => (
                    <span key={kpi} className="px-2 py-0.5 rounded-md text-xs bg-muted/50 border border-border text-muted-foreground">
                      Track: {kpi}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className={`text-2xl font-bold font-display ${channel.text}`}>{channel.allocation}%</div>
                <div className="text-xs text-muted-foreground">of budget</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { icon: TrendingUp, label: "Expected ROAS", value: "3–5x", desc: "Return on ad spend" },
          { icon: Users, label: "Est. Reach", value: "200K+", desc: "Monthly impressions" },
          { icon: DollarSign, label: "Target CAC", value: "< $40", desc: "Cost per acquisition" },
        ].map((metric, idx) => (
          <div key={idx} data-testid={`metric-card-${idx}`} className="p-3.5 rounded-xl bg-background/50 border border-border text-center">
            <metric.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
            <div className="text-lg font-bold font-display text-foreground">{metric.value}</div>
            <div className="text-xs font-medium text-foreground">{metric.label}</div>
            <div className="text-xs text-muted-foreground">{metric.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-chart-3/5 border border-chart-3/15">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold" style={{ color: "hsl(160 84% 39%)" }}>Stage 3 of 4 complete.</span> This channel mix is optimized for your{" "}
          <span className="text-foreground">{formData.campaignGoal.replace(/-/g, " ")}</span> goal. Proceed to{" "}
          <span className="text-foreground font-medium">Stage 4</span> to generate your A/B test plan.
        </p>
      </div>
    </div>
  );
}
