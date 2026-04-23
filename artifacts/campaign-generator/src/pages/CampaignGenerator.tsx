import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Target, DollarSign, Users, ChevronRight, Lightbulb, Megaphone, BarChart2, FlaskConical, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OutputSection from "@/components/OutputSection";
import StageIndicator from "@/components/StageIndicator";

const campaignSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  productDescription: z.string().min(10, "Please describe your product in at least 10 characters"),
  targetAudience: z.string().min(5, "Describe your target audience"),
  audienceAge: z.string().min(1, "Please select an age range"),
  audienceLocation: z.string().min(2, "Enter target location(s)"),
  budget: z.string().min(1, "Please select a budget range"),
  customBudget: z.string().optional(),
  campaignGoal: z.string().min(1, "Please select a campaign goal"),
  timeline: z.string().min(1, "Please select a timeline"),
  industry: z.string().min(1, "Please select an industry"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const STAGES = [
  { id: 1, label: "Campaign Ideas", icon: Lightbulb },
  { id: 2, label: "Ad Copies", icon: Megaphone },
  { id: 3, label: "Channel Mix", icon: BarChart2 },
  { id: 4, label: "A/B Test Plan", icon: FlaskConical },
];

export default function CampaignGenerator() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData | null>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      targetAudience: "",
      audienceAge: "",
      audienceLocation: "",
      budget: "",
      customBudget: "",
      campaignGoal: "",
      timeline: "",
      industry: "",
    },
  });

  const budgetValue = form.watch("budget");

  function onSubmit(data: CampaignFormData) {
    setFormData(data);
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
    setFormData(null);
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground tracking-tight">CampaignForge</span>
          </div>
          <div className="flex items-center gap-2">
            {STAGES.map((stage, idx) => (
              <div key={stage.id} className="flex items-center gap-2">
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${submitted ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                  <stage.icon className="w-3 h-3" />
                  <span>{stage.label}</span>
                </div>
                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!submitted ? (
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Campaign Generator
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Build campaigns that{" "}
                <span className="gradient-text">actually convert</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Fill in your product details and we'll generate tailored campaign ideas, ad copies, channel recommendations, and A/B testing plans — one stage at a time.
              </p>
            </div>

            {/* Stage preview pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {STAGES.map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {stage.id}
                    </div>
                    <stage.icon className="w-3.5 h-3.5" />
                    {stage.label}
                  </div>
                  {idx < STAGES.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Product Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                        <Target className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h2 className="font-display font-semibold text-foreground">Product Details</h2>
                    </div>
                    <div className="grid gap-5">
                      <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Product / Brand Name</FormLabel>
                            <FormControl>
                              <Input
                                data-testid="input-product-name"
                                placeholder="e.g. Luminary Skincare"
                                className="bg-background border-input h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-industry" className="bg-background border-input h-11">
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beauty">Beauty & Skincare</SelectItem>
                                <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                                <SelectItem value="food">Food & Beverage</SelectItem>
                                <SelectItem value="tech">Technology & SaaS</SelectItem>
                                <SelectItem value="health">Health & Wellness</SelectItem>
                                <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                                <SelectItem value="finance">Finance & Fintech</SelectItem>
                                <SelectItem value="education">Education & EdTech</SelectItem>
                                <SelectItem value="travel">Travel & Hospitality</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Product Description</FormLabel>
                            <FormControl>
                              <Textarea
                                data-testid="textarea-product-description"
                                placeholder="Describe what your product does, its key benefits, and what makes it unique..."
                                className="bg-background border-input resize-none min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="campaignGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Campaign Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-campaign-goal" className="bg-background border-input h-11">
                                  <SelectValue placeholder="What do you want to achieve?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="awareness">Brand Awareness</SelectItem>
                                <SelectItem value="leads">Lead Generation</SelectItem>
                                <SelectItem value="conversions">Drive Conversions / Sales</SelectItem>
                                <SelectItem value="retention">Customer Retention</SelectItem>
                                <SelectItem value="engagement">Boost Engagement</SelectItem>
                                <SelectItem value="launch">Product Launch</SelectItem>
                                <SelectItem value="app-installs">App Installs</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Audience Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <h2 className="font-display font-semibold text-foreground">Target Audience</h2>
                    </div>
                    <div className="grid gap-5">
                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Audience Description</FormLabel>
                            <FormControl>
                              <Textarea
                                data-testid="textarea-target-audience"
                                placeholder="e.g. Busy professionals aged 25-40 who care about their health but don't have time for complicated routines..."
                                className="bg-background border-input resize-none min-h-[90px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="audienceAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Age Range</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-audience-age" className="bg-background border-input h-11">
                                    <SelectValue placeholder="Age range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="13-17">13–17</SelectItem>
                                  <SelectItem value="18-24">18–24</SelectItem>
                                  <SelectItem value="25-34">25–34</SelectItem>
                                  <SelectItem value="35-44">35–44</SelectItem>
                                  <SelectItem value="45-54">45–54</SelectItem>
                                  <SelectItem value="55-64">55–64</SelectItem>
                                  <SelectItem value="65+">65+</SelectItem>
                                  <SelectItem value="all">All ages</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="audienceLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Location(s)</FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-audience-location"
                                  placeholder="e.g. USA, UK, Global"
                                  className="bg-background border-input h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Budget Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-md bg-chart-3/20 flex items-center justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-chart-3" />
                      </div>
                      <h2 className="font-display font-semibold text-foreground">Budget & Timeline</h2>
                    </div>
                    <div className="grid gap-5">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Monthly Budget</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-budget" className="bg-background border-input h-11">
                                    <SelectValue placeholder="Select budget" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                                  <SelectItem value="1k-5k">$1,000 – $5,000</SelectItem>
                                  <SelectItem value="5k-10k">$5,000 – $10,000</SelectItem>
                                  <SelectItem value="10k-50k">$10,000 – $50,000</SelectItem>
                                  <SelectItem value="50k-100k">$50,000 – $100,000</SelectItem>
                                  <SelectItem value="100k+">$100,000+</SelectItem>
                                  <SelectItem value="custom">Custom amount</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Campaign Timeline</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-timeline" className="bg-background border-input h-11">
                                    <SelectValue placeholder="Duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-week">1 Week</SelectItem>
                                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                                  <SelectItem value="1-month">1 Month</SelectItem>
                                  <SelectItem value="3-months">3 Months</SelectItem>
                                  <SelectItem value="6-months">6 Months</SelectItem>
                                  <SelectItem value="1-year">1 Year</SelectItem>
                                  <SelectItem value="ongoing">Ongoing</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {budgetValue === "custom" && (
                        <FormField
                          control={form.control}
                          name="customBudget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Custom Budget Amount</FormLabel>
                              <FormControl>
                                <Input
                                  data-testid="input-custom-budget"
                                  placeholder="e.g. $25,000/month"
                                  className="bg-background border-input h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      data-testid="button-generate-campaign"
                      className="w-full h-12 text-base font-semibold glow-primary bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Campaign Strategy
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Generates 4 stages: Ideas → Ad Copy → Channels → A/B Tests
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <OutputSection formData={formData!} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
