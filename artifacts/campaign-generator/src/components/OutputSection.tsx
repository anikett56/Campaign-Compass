import { useState } from "react";
import { Lightbulb, Megaphone, BarChart2, FlaskConical, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StageIndicator from "@/components/StageIndicator";
import CampaignIdeasStage from "@/components/stages/CampaignIdeasStage";
import AdCopiesStage from "@/components/stages/AdCopiesStage";
import ChannelMixStage from "@/components/stages/ChannelMixStage";
import ABTestStage from "@/components/stages/ABTestStage";

interface OutputSectionProps {
  formData: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    audienceAge: string;
    audienceLocation: string;
    budget: string;
    customBudget?: string;
    campaignGoal: string;
    timeline: string;
    industry: string;
  };
  onReset: () => void;
}

const STAGES = [
  { id: 1, label: "Campaign Ideas", icon: Lightbulb },
  { id: 2, label: "Ad Copies", icon: Megaphone },
  { id: 3, label: "Channel Mix", icon: BarChart2 },
  { id: 4, label: "A/B Test Plan", icon: FlaskConical },
];

export default function OutputSection({ formData, onReset }: OutputSectionProps) {
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
    if (activeStage > 1) {
      setActiveStage(activeStage - 1);
    }
  }

  function handleGoToStage(stageId: number) {
    if (unlockedStages.includes(stageId)) {
      setActiveStage(stageId);
    }
  }

  const completedStages = unlockedStages.filter((s) => s < activeStage);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Summary bar */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">{formData.productName}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {formData.industry} · {formData.audienceLocation} · {formData.budget === "custom" ? formData.customBudget : formData.budget}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          data-testid="button-reset"
          className="text-muted-foreground hover:text-foreground border-border"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Start Over
        </Button>
      </div>

      {/* Stage indicator */}
      <div className="flex justify-center mb-8">
        <StageIndicator activeStage={activeStage} completedStages={completedStages} />
      </div>

      {/* Stage navigation tabs */}
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
        {activeStage === 1 && <CampaignIdeasStage formData={formData} />}
        {activeStage === 2 && <AdCopiesStage formData={formData} />}
        {activeStage === 3 && <ChannelMixStage formData={formData} />}
        {activeStage === 4 && <ABTestStage formData={formData} />}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStage}
          disabled={activeStage === 1}
          data-testid="button-prev-stage"
          className="border-border text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        {activeStage < 4 ? (
          <Button
            onClick={handleNextStage}
            data-testid="button-next-stage"
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
          >
            Next Stage
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={onReset}
            data-testid="button-new-campaign"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            New Campaign
          </Button>
        )}
      </div>
    </div>
  );
}
