import { FlaskConical, CheckCircle2 } from "lucide-react";
import type { CampaignItem } from "@workspace/api-client-react";

interface Props {
  items: CampaignItem[];
  productName: string;
}

const PRIORITY_BADGE: Record<string, { badge: string; label: string }> = {
  High: { badge: "bg-destructive/10 text-destructive border-destructive/20", label: "Run First" },
  Medium: { badge: "bg-chart-4/10 text-chart-4 border-chart-4/20", label: "Run Second" },
  Low: { badge: "bg-muted text-muted-foreground border-border", label: "Optional" },
};

export default function ABTestStage({ items, productName }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-chart-4/20 border border-chart-4/30 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">A/B Test Plan</h3>
          <p className="text-muted-foreground text-sm">
            {items.length} structured experiments for <span className="text-foreground font-medium">{productName}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4" data-testid="ab-tests-list">
        {items.map((item, idx) => {
          const content = item.content as Record<string, unknown>;
          const channel = typeof content.channel === "string" ? content.channel : null;
          const hypothesis = typeof content.hypothesis === "string" ? content.hypothesis : null;
          const sampleSize = typeof content.sampleSize === "string" ? content.sampleSize : null;
          const duration = typeof content.duration === "string" ? content.duration : null;
          const significance = typeof content.significance === "string" ? content.significance : null;
          const estimatedLift = typeof content.estimatedLift === "string" ? content.estimatedLift : null;

          const variantA = content.variantA as { label?: string; metric?: string; target?: string } | undefined;
          const variantB = content.variantB as { label?: string; metric?: string; target?: string } | undefined;

          const pStyle = PRIORITY_BADGE[item.priority] ?? PRIORITY_BADGE["Low"];

          return (
            <div
              key={item.id}
              data-testid={`ab-test-${idx}`}
              className="rounded-xl border border-border bg-background/30 overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-3 bg-muted/20 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-xs font-bold font-display text-muted-foreground">
                    T{idx + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-foreground">{item.title}</span>
                    {channel && <span className="text-xs text-muted-foreground ml-2">· {channel}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Score: <span className="font-bold text-foreground">{item.score}</span></span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${pStyle.badge}`}>
                    {pStyle.label}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.description}</p>

                {/* Hypothesis */}
                {hypothesis && (
                  <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Hypothesis: </span>
                      {hypothesis}
                    </p>
                  </div>
                )}

                {/* Variants */}
                {(variantA || variantB) && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[variantA, variantB].map((variant, vIdx) => variant && (
                      <div
                        key={vIdx}
                        data-testid={`variant-${idx}-${vIdx}`}
                        className={`p-3.5 rounded-lg border ${vIdx === 0 ? "border-border bg-muted/20" : "border-primary/25 bg-primary/5"}`}
                      >
                        <div className={`text-xs font-bold mb-1.5 ${vIdx === 0 ? "text-muted-foreground" : "text-primary"}`}>
                          {vIdx === 0 ? "A — Control" : "B — Challenger"}
                        </div>
                        <p className="text-xs text-foreground leading-snug mb-2">{variant.label}</p>
                        {variant.metric && variant.target && (
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${vIdx === 0 ? "bg-muted border border-border text-muted-foreground" : "bg-primary/10 border border-primary/20 text-primary"}`}>
                            Target {variant.metric}: {variant.target}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Meta details */}
                <div className="flex flex-wrap gap-3">
                  {[
                    sampleSize && { label: "Sample Size", value: sampleSize },
                    duration && { label: "Duration", value: duration },
                    significance && { label: "Significance", value: significance },
                    estimatedLift && { label: "Est. Lift", value: estimatedLift },
                  ].filter(Boolean).map((detail) => detail && (
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

      <div className="mt-5 p-4 rounded-xl bg-chart-4/5 border border-chart-4/15">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-chart-4">All 4 stages complete!</span> Your full strategy for{" "}
          <span className="text-foreground font-medium">{productName}</span> is ready. Run high-priority tests first and let each test run its full duration before declaring a winner.
        </p>
      </div>
    </div>
  );
}
