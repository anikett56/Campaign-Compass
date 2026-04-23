import { Lightbulb } from "lucide-react";
import type { CampaignItem } from "@workspace/api-client-react";

interface Props {
  items: CampaignItem[];
  productName: string;
  goal: string;
}

const PRIORITY_BADGE: Record<string, string> = {
  High: "bg-primary/15 text-primary border-primary/25",
  Medium: "bg-accent/15 text-accent border-accent/25",
  Low: "bg-muted border-border text-muted-foreground",
};

const SCORE_COLOR = (score: number) => {
  if (score >= 75) return "text-primary";
  if (score >= 55) return "text-accent";
  return "text-muted-foreground";
};

export default function CampaignIdeasStage({ items, productName, goal }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Campaign Ideas</h3>
          <p className="text-muted-foreground text-sm">
            {items.length} tailored concepts for <span className="text-foreground font-medium">{productName}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4" data-testid="campaign-ideas-list">
        {items.map((item, idx) => {
          const content = item.content as Record<string, unknown>;
          const tactics = Array.isArray(content.tactics) ? (content.tactics as string[]) : [];
          const keyMessage = typeof content.keyMessage === "string" ? content.keyMessage : null;
          const angle = typeof content.angle === "string" ? content.angle : null;

          return (
            <div
              key={item.id}
              data-testid={`campaign-idea-${idx}`}
              className="p-5 rounded-xl border border-border bg-background/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_BADGE[item.priority]}`}>
                      {item.priority} Priority
                    </span>
                    {angle && (
                      <span className="px-2 py-0.5 rounded-full text-xs border border-border bg-muted text-muted-foreground">
                        {angle}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-foreground text-base mb-1">{item.title}</h4>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-xl font-bold font-display ${SCORE_COLOR(item.score)}`}>{item.score}</div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.description}</p>

              {keyMessage && (
                <p className="text-accent text-sm font-medium italic mb-3">"{keyMessage}"</p>
              )}

              {tactics.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tactics.map((tactic) => (
                    <span key={tactic} className="px-2 py-0.5 rounded-md text-xs bg-muted/50 border border-border text-muted-foreground">
                      {tactic}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Effort: <span className="text-foreground font-medium">{item.effort}</span></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-semibold">Stage 1 complete.</span> These concepts are scored and prioritized for your{" "}
          <span className="text-foreground">{goal.replace(/-/g, " ")}</span> goal. Advance to Stage 2 for ready-to-use ad copy.
        </p>
      </div>
    </div>
  );
}
