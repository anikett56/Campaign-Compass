import { Lightbulb, Megaphone, BarChart2, FlaskConical, Check } from "lucide-react";

const STAGES = [
  { id: 1, label: "Campaign Ideas", icon: Lightbulb, color: "primary" },
  { id: 2, label: "Ad Copies", icon: Megaphone, color: "accent" },
  { id: 3, label: "Channel Mix", icon: BarChart2, color: "chart-3" },
  { id: 4, label: "A/B Test Plan", icon: FlaskConical, color: "chart-4" },
];

interface StageIndicatorProps {
  activeStage: number;
  completedStages: number[];
}

export default function StageIndicator({ activeStage, completedStages }: StageIndicatorProps) {
  return (
    <div className="flex items-center gap-0" data-testid="stage-indicator">
      {STAGES.map((stage, idx) => {
        const isActive = stage.id === activeStage;
        const isCompleted = completedStages.includes(stage.id);
        const Icon = stage.icon;

        return (
          <div key={stage.id} className="flex items-center">
            <div
              className={`flex flex-col items-center gap-1.5 ${isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"}`}
              data-testid={`stage-item-${stage.id}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : isActive
                    ? "bg-primary/20 border-primary/50 text-primary shadow-sm"
                    : "bg-muted/50 border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
            {idx < STAGES.length - 1 && (
              <div
                className={`w-12 h-px mx-1 mb-5 transition-all duration-300 ${
                  completedStages.includes(stage.id) ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
