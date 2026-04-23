import { Megaphone, Copy, Check } from "lucide-react";
import { useState } from "react";

interface StageProps {
  formData: {
    productName: string;
    targetAudience: string;
    campaignGoal: string;
    audienceAge: string;
  };
}

const AD_FORMATS = [
  {
    format: "Social Media — Short",
    platform: "Instagram / TikTok",
    icon: "📱",
    copies: [
      {
        label: "Hook-First",
        headline: "Stop scrolling. This changes everything.",
        body: "Tired of products that overpromise? Meet the one that actually delivers. Real results, real fast.",
        cta: "Shop Now →",
      },
      {
        label: "Problem-Solution",
        headline: "Why is this so hard to find?",
        body: "You've tried everything. We built the thing that finally works. No fluff, no filler — just results.",
        cta: "See How →",
      },
    ],
  },
  {
    format: "Search Ad",
    platform: "Google Ads",
    icon: "🔍",
    copies: [
      {
        label: "Benefit-Lead",
        headline: "Get Results in 30 Days — Guaranteed",
        body: "Join 50,000+ customers who switched to the smarter solution. Free shipping on all orders. Try risk-free.",
        cta: "Start Today",
      },
      {
        label: "Urgency",
        headline: "Limited Offer — 30% Off Today Only",
        body: "Don't miss the sale everyone's talking about. Award-winning quality, half the price. Ends midnight.",
        cta: "Claim Offer",
      },
    ],
  },
  {
    format: "Display / Banner",
    platform: "Google Display / Programmatic",
    icon: "🖥️",
    copies: [
      {
        label: "Trust-First",
        headline: "As seen in Forbes, Wired & TechCrunch",
        body: "The product professionals trust. Join thousands who made the switch.",
        cta: "Learn More",
      },
    ],
  },
  {
    format: "Email Subject Lines",
    platform: "Email Marketing",
    icon: "✉️",
    copies: [
      { label: "Curiosity", headline: "We probably shouldn't tell you this...", body: "", cta: "" },
      { label: "Urgency", headline: "⏰ Only 24 hrs left (don't miss this)", body: "", cta: "" },
      { label: "Personalization", headline: "This was made for people like you", body: "", cta: "" },
    ],
  },
];

export default function AdCopiesStage({ formData }: StageProps) {
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
            Ready-to-use copy for <span className="text-foreground font-medium">{formData.productName}</span> across formats
          </p>
        </div>
      </div>

      {/* Audience reminder */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
        <span className="text-xs text-muted-foreground font-medium mr-1">Audience:</span>
        <span className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-foreground">{formData.targetAudience}</span>
        <span className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-foreground">Age: {formData.audienceAge}</span>
        <span className="px-2.5 py-1 rounded-full bg-card border border-border text-xs text-foreground">Goal: {formData.campaignGoal.replace(/-/g, " ")}</span>
      </div>

      <div className="space-y-5" data-testid="ad-copies-list">
        {AD_FORMATS.map((format, fIdx) => (
          <div key={fIdx} data-testid={`ad-format-${fIdx}`} className="rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border flex items-center gap-2">
              <span className="text-base">{format.icon}</span>
              <span className="font-semibold text-sm text-foreground">{format.format}</span>
              <span className="text-xs text-muted-foreground ml-1">— {format.platform}</span>
            </div>
            <div className="divide-y divide-border">
              {format.copies.map((copy, cIdx) => {
                const copyId = `${fIdx}-${cIdx}`;
                const textToCopy = [copy.headline, copy.body, copy.cta].filter(Boolean).join("\n\n");
                return (
                  <div
                    key={cIdx}
                    data-testid={`ad-copy-${copyId}`}
                    className="p-4 bg-background/30 hover:bg-primary/3 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted border border-border text-muted-foreground">
                            {copy.label}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground text-sm mb-1">{copy.headline}</p>
                        {copy.body && <p className="text-muted-foreground text-sm leading-relaxed mb-1.5">{copy.body}</p>}
                        {copy.cta && (
                          <span className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                            {copy.cta}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(textToCopy, copyId)}
                        data-testid={`button-copy-${copyId}`}
                        className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copiedId === copyId ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/15">
        <p className="text-xs text-muted-foreground">
          <span className="text-accent font-semibold">Stage 2 of 4 complete.</span> These ad copies are written to match your target audience. Hover any copy and click the clipboard icon to copy it. Proceed to{" "}
          <span className="text-foreground font-medium">Stage 3</span> to see your recommended channel mix and budget allocation.
        </p>
      </div>
    </div>
  );
}
