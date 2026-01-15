"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AnalysisResultProps {
  isAuthentic: boolean;
  confidence: number;
  isLoading?: boolean;
}

export function AnalysisResult({
  isAuthentic,
  confidence,
  isLoading,
}: AnalysisResultProps) {
  const displayConfidence = Math.round(confidence * 100);

  if (isLoading) {
    return (
      <Card className="p-8 bg-card border border-primary/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-foreground font-medium">Analyzing image...</p>
          <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent animate-shimmer" />
          </div>
        </div>
      </Card>
    );
  }
 

  return (
    <Card
      className={`p-8 border overflow-hidden animate-fade-in-up shadow-lg transition-all duration-500 ${
        isAuthentic
          ? "border-success/40 bg-card"
          : "border-destructive/40 bg-card"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isAuthentic
              ? "bg-gradient-to-br from-success/30 to-success/10 animate-glow"
              : "bg-gradient-to-br from-destructive/30 to-destructive/10 animate-glow"
          }`}
        >
          {isAuthentic ? (
            <CheckCircle2 className="w-8 h-8 text-success" />
          ) : (
            <AlertCircle className="w-8 h-8 text-destructive" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground">
            {isAuthentic ? "Authentic Image" : "AI-Generated Detected"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {isAuthentic
              ? "This image appears to be genuinely captured or created"
              : "This image shows characteristics of synthetic generation"}
          </p>
        </div>

        <div className="w-full space-y-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Confidence Score
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {displayConfidence}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden border border-primary/10">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                isAuthentic
                  ? "bg-gradient-to-r from-success to-success/80"
                  : "bg-gradient-to-r from-destructive to-destructive/80"
              }`}
              style={{ width: `${displayConfidence}%` }}
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-3 border border-primary/20 hover:border-primary/40 transition-colors">
            <p className="text-xs font-semibold text-muted-foreground">
              Status
            </p>
            <p className="text-sm font-bold text-foreground mt-1">
              {isAuthentic ? "Authentic" : "Synthetic"}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 p-3 border border-accent/20 hover:border-accent/40 transition-colors">
            <p className="text-xs font-semibold text-muted-foreground">
              Analysis
            </p>
            <p className="text-sm font-bold text-foreground mt-1">Complete</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
