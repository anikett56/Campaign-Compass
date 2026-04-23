import { useState } from "react";
import { Megaphone, Copy, Check } from "lucide-react";
import type { CampaignItem } from "@workspace/api-client-react";

interface Props {
  items: CampaignItem[];
  productName: string;
}

const PRIORITY_BADGE: Record<string, string> = {
  High: "bg-accent/15 text-accent border-accent/25",
  Medium: "bg-muted border-border text-muted-foreground",
  Low: "bg-muted/50 border-border/50 text-muted-foreground/70",
};

export default function AdCopiesStage({ items, productName }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Ad Copies</h3>
          <p className="text-muted-foreground text-sm">
            {items.length} ready-to-use copies for <span className="text-foreground font-medium">{productName}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4" data-testid="ad-copies-list">
        {items.map((item, idx) => {
          const content = item.content as Record<string, unknown>;
          const platform = typeof content.platform === "string" ? content.platform : null;
          const format = typeof content.format === "string" ? content.format : null;
          const headline = typeof content.headline === "string" ? content.headline : null;
          const body = typeof content.body === "string" ? content.body : null;
          const cta = typeof content.cta === "string" ? content.cta : null;
          const toneTag = typeof content.toneTag === "string" ? content.toneTag : null;
          const variants = Array.isArray(content.variants) ? (content.variants as string[]) : null;

          const copyText = variants
            ? variants.join("\n")
            : [headline, body, cta].filter(Boolean).join("\n\n");

          return (
            <div
              key={item.id}
              data-testid={`ad-copy-${idx}`}
              className="rounded-xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-3 bg-muted/20 border-b border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{item.title}</span>
                  {platform && <span className="text-xs text-muted-foreground">— {platform}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_BADGE[item.priority]}`}>
                    Score: {item.score}
                  </span>
                  <button
                    onClick={() => handleCopy(copyText, item.id)}
                    data-testid={`button-copy-${idx}`}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 bg-background/30">
                {format && (
                  <p className="text-xs text-muted-foreground mb-3">Format: <span className="text-foreground">{format}</span></p>
                )}

                {/* Email-style variants */}
                {variants ? (
                  <div className="space-y-2">
                    {variants.map((v, vi) => (
                      <div key={vi} className="p-3 rounded-lg bg-muted/30 border border-border">
                        <span className="text-xs font-semibold text-muted-foreground mr-2">Option {vi + 1}:</span>
                        <span className="text-sm font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {headline && (
                      <p className="font-semibold text-foreground text-sm">{headline}</p>
                    )}
                    {body && (
                      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                    )}
                    {cta && (
                      <span className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {cta}
                      </span>
                    )}
                  </div>
                )}

                {toneTag && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Tone: <span className="text-foreground italic">{toneTag}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/15">
        <p className="text-xs text-muted-foreground">
          <span className="text-accent font-semibold">Stage 2 complete.</span> Hover any card and click the clipboard icon to copy the copy. Advance to Stage 3 for your channel mix and budget breakdown.
        </p>
      </div>
    </div>
  );
}
