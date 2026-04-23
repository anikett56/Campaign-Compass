import { FlaskConical, CheckCircle2, AlertCircle, ArrowUpDown, BarChart } from "lucide-react";

interface StageProps {
  formData: {
    productName: string;
    campaignGoal: string;
    budget: string;
    targetAudience: string;
  };
}

const AB_TESTS = [
  {
    id: "T1",
    name: "Creative Format Test",
    channel: "Meta Ads",
    hypothesis: "Video creative will outperform static image in click-through rate for our target demographic.",
    variantA: {
      label: "Control",
      description: "Static image carousel with product shots",
      metric: "CTR",
      target: "2.5%",
    },
    variantB: {
      label: "Challenger",
      description: "15-second UGC-style video with voiceover",
      metric: "CTR",
      target: "4.0%+",
    },
    sampleSize: "10,000 impressions each",
    duration: "2 weeks",
    significance: "95% confidence level",
    priority: "high",
  },
  {
    id: "T2",
    name: "Headline Angle Test",
    channel: "Google Search",
    hypothesis: "Benefit-focused headlines will drive higher conversion rate than feature-focused headlines.",
    variantA: {
      label: "Control",
      description: "Feature headline: '15 Advanced Features You'll Love'",
      metric: "CVR",
      target: "3.2%",
    },
    variantB: {
      label: "Challenger",
      description: "Benefit headline: 'Save 5 Hours a Week — Guaranteed'",
      metric: "CVR",
      target: "5.0%+",
    },
    sampleSize: "500 clicks each",
    duration: "3 weeks",
    significance: "95% confidence level",
    priority: "high",
  },
  {
    id: "T3",
    name: "Audience Segment Test",
    channel: "Meta Ads",
    hypothesis: "Interest-based targeting will yield lower CPL than lookalike audience targeting.",
    variantA: {
      label: "Control",
      description: "Lookalike audience (2%) based on existing customers",
      metric: "CPL",
      target: "$28",
    },
    variantB: {
      label: "Challenger",
      description: "Interest-based: competitor followers + relevant interests",
      metric: "CPL",
      target: "< $20",
    },
    sampleSize: "$500 spend each",
    duration: "2 weeks",
    significance: "90% confidence level",
    priority: "medium",
  },
  {
    id: "T4",
    name: "CTA Copy Test",
    channel: "Landing Page",
    hypothesis: "Urgency-driven CTA will increase conversion rate vs. standard CTA.",
    variantA: {
      label: "Control",
      description: "Button text: 'Get Started'",
      metric: "CVR",
      target: "3.5%",
    },
    variantB: {
      label: "Challenger",
      description: "Button text: 'Start My Free Trial — No Card Required'",
      metric: "CVR",
      target: "5.0%+",
    },
    sampleSize: "1,000 visitors each",
    duration: "1 week",
    significance: "95% confidence level",
    priority: "medium",
  },
];

const PRIORITY_COLORS: Record<string, { badge: string; dot: string }> = {
  high: { badge: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
  medium: { badge: "bg-chart-4/10 text-chart-4 border-chart-4/20", dot: "bg-chart-4" },
  low: { badge: "bg-muted/50 text-muted-foreground border-border", dot: "bg-muted-foreground" },
};

export default function ABTestStage({ formData }: StageProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-chart-4/20 border border-chart-4/30 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">A/B Test Plan</h3>
          <p className="text-muted-foreground text-sm">
            4 structured experiments for <span className="text-foreground font-medium">{formData.productName}</span>
          </p>
        </div>
      </div>

      {/* Testing principles */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: FlaskConical, label: "One variable at a time", desc: "Isolate what's being tested" },
          { icon: BarChart, label: "Statistical significance", desc: "95% confidence minimum" },
          { icon: ArrowUpDown, label: "Run tests sequentially", desc: "High priority first" },
        ].map((tip, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-background/50 border border-border text-center">
            <tip.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-foreground">{tip.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{tip.desc}</div>
          </div>
        ))}
      </div>

      {/* Test cards */}
      <div className="space-y-4" data-testid="ab-tests-list">
        {AB_TESTS.map((test, idx) => {
          const pColors = PRIORITY_COLORS[test.priority];
          return (
            <div
              key={idx}
              data-testid={`ab-test-${idx}`}
              className="rounded-xl border border-border bg-background/30 overflow-hidden"
            >
              {/* Test header */}
              <div className="px-5 py-3 bg-muted/20 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-xs font-bold font-display text-muted-foreground">
                    {test.id}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-foreground">{test.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">· {test.channel}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${pColors.badge}`}>
                  {test.priority === "high" ? "Run First" : "Run Second"}
                </span>
              </div>

              <div className="p-5">
                {/* Hypothesis */}
                <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Hypothesis: </span>
                    {test.hypothesis}
                  </p>
                </div>

                {/* Variants */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[test.variantA, test.variantB].map((variant, vIdx) => (
                    <div
                      key={vIdx}
                      data-testid={`variant-${idx}-${vIdx}`}
                      className={`p-3.5 rounded-lg border ${vIdx === 0 ? "border-border bg-muted/20" : "border-primary/25 bg-primary/5"}`}
                    >
                      <div className={`text-xs font-bold mb-1.5 ${vIdx === 0 ? "text-muted-foreground" : "text-primary"}`}>
                        {vIdx === 0 ? "A" : "B"} — {variant.label}
                      </div>
                      <p className="text-xs text-foreground leading-snug mb-2">{variant.description}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${vIdx === 0 ? "bg-muted border border-border text-muted-foreground" : "bg-primary/10 border border-primary/20 text-primary"}`}>
                        Target {variant.metric}: {variant.target}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Test details */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Sample Size", value: test.sampleSize },
                    { label: "Duration", value: test.duration },
                    { label: "Significance", value: test.significance },
                  ].map((detail) => (
                    <div key={detail.label} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-primary/70" />
                      <span className="text-xs text-muted-foreground">
                        {detail.label}: <span className="text-foreground font-medium">{detail.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Test schedule */}
      <div className="mt-5 p-5 rounded-xl bg-muted/20 border border-border">
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">Recommended Test Schedule</h4>
        <div className="space-y-2">
          {[
            { week: "Week 1–2", test: "T1: Creative Format Test + T2: Headline Angle Test", status: "Run concurrently (different channels)" },
            { week: "Week 3–4", test: "T3: Audience Segment Test", status: "Based on T1 winner" },
            { week: "Week 5", test: "T4: CTA Copy Test", status: "Based on T2 + T3 learnings" },
            { week: "Week 6+", test: "Scale winning variants", status: "Reallocate budget to best performers" },
          ].map((row, idx) => (
            <div key={idx} data-testid={`schedule-row-${idx}`} className="flex gap-3 text-xs">
              <span className="font-semibold text-foreground w-24 flex-shrink-0">{row.week}</span>
              <span className="text-muted-foreground">{row.test} — <span className="text-foreground/70 italic">{row.status}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl bg-chart-4/5 border border-chart-4/15">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-chart-4">All 4 stages complete!</span> Your full campaign strategy for{" "}
          <span className="text-foreground font-medium">{formData.productName}</span> is ready. Start with the high-priority tests and iterate based on real data. Run each test for its full duration before declaring a winner.
        </p>
      </div>
    </div>
  );
}
