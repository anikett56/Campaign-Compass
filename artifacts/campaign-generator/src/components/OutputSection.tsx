import { useState } from "react";
import { Lightbulb, Megaphone, BarChart2, FlaskConical, RotateCcw, ChevronRight, ChevronLeft, TrendingUp, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CampaignResult } from "@workspace/api-client-react";
import StageIndicator from "@/components/StageIndicator";
import CampaignIdeasStage from "@/components/stages/CampaignIdeasStage";
import AdCopiesStage from "@/components/stages/AdCopiesStage";
import ChannelMixStage from "@/components/stages/ChannelMixStage";
import ABTestStage from "@/components/stages/ABTestStage";

interface OutputSectionProps {
  result: CampaignResult;
  formData: {
    productName: string;
    budget: string;
    customBudget?: string;
    industry: string;
    campaignGoal: string;
  };
  onReset: () => void;
}

const STAGES = [
  { id: 1, label: "Campaign Ideas", icon: Lightbulb },
  { id: 2, label: "Ad Copies", icon: Megaphone },
  { id: 3, label: "Channel Mix", icon: BarChart2 },
  { id: 4, label: "A/B Test Plan", icon: FlaskConical },
];

const RISK_COLORS: Record<string, string> = {
  High: "text-destructive bg-destructive/10 border-destructive/20",
  Medium: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  Low: "text-chart-3 bg-chart-3/10 border-chart-3/20",
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "text-primary bg-primary/10 border-primary/20",
  Medium: "text-accent bg-accent/10 border-accent/20",
  Low: "text-muted-foreground bg-muted border-border",
};

export default function OutputSection({ result, formData, onReset }: OutputSectionProps) {
  const [activeStage, setActiveStage] = useState(1);
  const [unlockedStages, setUnlockedStages] = useState<number[]>([1]);

  function handleNextStage() {
    const next = activeStage + 1;
    if (next <= 4) {
      setUnlockedStages((prev) => (prev.includes(next) ? prev : [...prev, next]));
      setActiveStage(next);
    }
  }

  function handlePrevStage() {
    if (activeStage > 1) setActiveStage(activeStage - 1);
  }

  function handleGoToStage(stageId: number) {
    if (unlockedStages.includes(stageId)) setActiveStage(stageId);
  }

  const completedStages = unlockedStages.filter((s) => s < activeStage);
  const { metadata, insights } = result;

  const ideas = result.items.filter((i) => i.type === "campaign_idea");
  const copies = result.items.filter((i) => i.type === "ad_copy");
  const tests = result.items.filter((i) => i.type === "ab_test");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground tracking-tight">AdMojo</span>
          </div>
          <Button variant="outline" size="sm" onClick={onReset} data-testid="button-reset" className="text-muted-foreground hover:text-foreground border-border">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            New Campaign
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Score & metadata banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: TrendingUp,
              label: "Readiness Score",
              value: `${metadata.overallScore}/100`,
              sub: metadata.classification,
              color: "text-primary",
            },
            {
              icon: Shield,
              label: "Risk Level",
              value: metadata.risk,
              sub: "Campaign risk",
              badgeClass: RISK_COLORS[metadata.risk],
            },
            {
              icon: Target,
              label: "Goal Alignment",
              value: `${metadata.goalAlignment}%`,
              sub: formData.campaignGoal.replace(/-/g, " "),
              color: "text-chart-3",
            },
            {
              icon: Zap,
              label: "Priority",
              value: metadata.priority,
              sub: metadata.budgetTier,
              badgeClass: PRIORITY_COLORS[metadata.priority],
            },
          ].map((card, idx) => (
            <div key={idx} data-testid={`metadata-card-${idx}`} className="bg-card border border-border rounded-xl p-4">
              <card.icon className="w-4 h-4 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              {card.badgeClass ? (
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${card.badgeClass}`}>{card.value}</span>
              ) : (
                <p className={`text-lg font-bold font-display ${card.color ?? "text-foreground"}`}>{card.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6" data-testid="campaign-summary">
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-6 space-y-2" data-testid="insights-list">
            {insights.map((insight, idx) => {
              const insightStyles: Record<string, { container: string; dot: string; label: string }> = {
                tip: { container: "bg-primary/5 border-primary/15", dot: "bg-primary", label: "Tip" },
                warning: { container: "bg-chart-4/5 border-chart-4/15", dot: "bg-chart-4", label: "Warning" },
                opportunity: { container: "bg-chart-3/5 border-chart-3/15", dot: "bg-chart-3", label: "Opportunity" },
                risk: { container: "bg-destructive/5 border-destructive/15", dot: "bg-destructive", label: "Risk" },
              };
              const style = insightStyles[insight.type] ?? insightStyles["tip"];
              return (
                <div key={idx} data-testid={`insight-${idx}`} className={`flex items-start gap-3 p-3 rounded-lg border ${style.container}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot} mt-1.5 flex-shrink-0`} />
                  <p className="text-xs text-foreground leading-relaxed">
                    <span className="font-semibold">{style.label}: </span>
                    {insight.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Stage navigator tabs */}
        <div className="flex justify-center mb-6">
          <StageIndicator activeStage={activeStage} completedStages={completedStages} />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {STAGES.map((stage) => {
            const isUnlocked = unlockedStages.includes(stage.id);
            const isActive = stage.id === activeStage;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                onClick={() => handleGoToStage(stage.id)}
                disabled={!isUnlocked}
                data-testid={`tab-stage-${stage.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : isUnlocked
                    ? "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/20 cursor-pointer"
                    : "bg-muted/30 border-border/50 text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? "bg-primary/20 text-primary" : isUnlocked ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground/40"}`}>
                  {stage.id}
                </div>
                <Icon className="w-3.5 h-3.5" />
                {stage.label}
                {!isUnlocked && <span className="text-xs opacity-50">🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Stage content */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
          {activeStage === 1 && <CampaignIdeasStage items={ideas} productName={formData.productName} goal={formData.campaignGoal} />}
          {activeStage === 2 && <AdCopiesStage items={copies} productName={formData.productName} />}
          {activeStage === 3 && <ChannelMixStage channelAllocation={result.channelAllocation} metadata={metadata} goal={formData.campaignGoal} />}
          {activeStage === 4 && <ABTestStage items={tests} productName={formData.productName} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevStage} disabled={activeStage === 1} data-testid="button-prev-stage" className="border-border text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          {activeStage < 4 ? (
            <Button onClick={handleNextStage} data-testid="button-next-stage" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
              Next Stage
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={onReset} data-testid="button-new-campaign" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              New Campaign
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
