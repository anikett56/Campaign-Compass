import { BarChart2 } from "lucide-react";
import type { ChannelAllocation, CampaignMetadata } from "@workspace/api-client-react";

interface Props {
  channelAllocation: ChannelAllocation[];
  metadata: CampaignMetadata;
  goal: string;
}

const CHANNEL_COLORS: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  "Paid Social": { bar: "hsl(252 87% 67%)", text: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  "Search / SEM": { bar: "hsl(198 93% 60%)", text: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  "Display Ads": { bar: "hsl(37 91% 55%)", text: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/20" },
  "Influencer": { bar: "hsl(340 82% 62%)", text: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/20" },
  "Email": { bar: "hsl(160 84% 39%)", text: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/20" },
  "Content / SEO": { bar: "hsl(280 70% 60%)", text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  "Retargeting": { bar: "hsl(15 80% 55%)", text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  "Push Notifications": { bar: "hsl(198 93% 60%)", text: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  "PR": { bar: "hsl(37 91% 55%)", text: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/20" },
  "App Store Ads": { bar: "hsl(252 87% 67%)", text: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
};

const FALLBACK_COLOR = { bar: "hsl(215 20% 55%)", text: "text-muted-foreground", bg: "bg-muted", border: "border-border" };

const PRIORITY_BADGE: Record<string, string> = {
  High: "bg-primary/15 text-primary border-primary/25",
  Medium: "bg-accent/15 text-accent border-accent/25",
  Low: "bg-muted border-border text-muted-foreground",
};

export default function ChannelMixStage({ channelAllocation, metadata, goal }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-chart-3/20 border border-chart-3/30 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-chart-3" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Channel Mix & Budget Allocation</h3>
          <p className="text-muted-foreground text-sm">
            Optimised for <span className="text-foreground font-medium">{goal.replace(/-/g, " ")}</span> · Budget tier: <span className="text-foreground">{metadata.budgetTier}</span>
          </p>
        </div>
      </div>

      {/* Visual allocation bar */}
      <div className="mb-6 p-5 bg-background/50 rounded-xl border border-border">
        <p className="text-xs text-muted-foreground font-medium mb-3">Budget Distribution</p>
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5" data-testid="budget-bar">
          {channelAllocation.map((ch, idx) => {
            const color = CHANNEL_COLORS[ch.channel] ?? FALLBACK_COLOR;
            return (
              <div
                key={idx}
                data-testid={`budget-bar-segment-${idx}`}
                style={{ width: `${ch.percentage}%`, backgroundColor: color.bar }}
                title={`${ch.channel}: ${ch.percentage}%`}
                className="rounded-sm first:rounded-l-full last:rounded-r-full"
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {channelAllocation.map((ch, idx) => {
            const color = CHANNEL_COLORS[ch.channel] ?? FALLBACK_COLOR;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color.bar }} />
                <span className="text-xs text-muted-foreground">{ch.channel} <span className="text-foreground font-medium">{ch.percentage}%</span></span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel cards */}
      <div className="space-y-3" data-testid="channel-list">
        {channelAllocation.map((ch, idx) => {
          const color = CHANNEL_COLORS[ch.channel] ?? FALLBACK_COLOR;
          return (
            <div
              key={idx}
              data-testid={`channel-card-${idx}`}
              className={`p-4 rounded-xl border ${color.border} ${color.bg} hover:scale-[1.005] transition-transform`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${color.text}`}>{ch.channel}</h4>
                    <span className={`px-1.5 py-0.5 rounded-md text-xs font-semibold border ${PRIORITY_BADGE[ch.priority]}`}>
                      {ch.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Est. monthly spend: <span className="text-foreground font-semibold">{ch.estimatedMonthlySpend}</span></p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-2xl font-bold font-display ${color.text}`}>{ch.percentage}%</div>
                  <div className="text-xs text-muted-foreground">of budget</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: "Overall Score", value: `${metadata.overallScore}/100`, desc: "Campaign readiness" },
          { label: "Effort Level", value: metadata.effort, desc: "Execution complexity" },
          { label: "Goal Alignment", value: `${metadata.goalAlignment}%`, desc: "Strategy fit" },
        ].map((card, idx) => (
          <div key={idx} data-testid={`score-card-${idx}`} className="p-3.5 rounded-xl bg-background/50 border border-border text-center">
            <div className="text-lg font-bold font-display text-foreground">{card.value}</div>
            <div className="text-xs font-medium text-foreground">{card.label}</div>
            <div className="text-xs text-muted-foreground">{card.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-chart-3/5 border border-chart-3/15">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold" style={{ color: "hsl(160 84% 39%)" }}>Stage 3 complete.</span> This allocation is engine-scored and goal-matched. Proceed to Stage 4 for your A/B test plan.
        </p>
      </div>
    </div>
  );
}
