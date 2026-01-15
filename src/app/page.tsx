"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { AnalysisResult } from "@/components/analysis-result";
import { Button } from "@/components/ui/button";
import { Shield, Zap } from "lucide-react";
import { FeedbackDialog } from "@/components/feedback-dialog";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    isAuthentic: boolean;
    confidence: number;
    embedding: number[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setTimeout(() => {
        setShowFeedback(true);
      }, 2000);
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background gradient-bg relative">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-xl animate-slide-down">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 animate-glow">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  AuthentiScan
                </h1>
                <p className="text-xs text-muted-foreground">
                  Detect authentic vs generated
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Verify Image Authenticity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Upload an image and get instant analysis on whether its authentic
              or AI-generated. Our advanced technology provides detailed
              confidence scoring.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Upload Image
                </h3>
              </div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                isLoading={isLoading}
              />

              {/* Action Button */}
              {selectedFile && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Analyze Image
                    </div>
                  )}
                </Button>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 animate-fade-in-up">
                  <p className="text-sm text-destructive font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Results
                </h3>
              </div>
              {result || isLoading ? (
                <AnalysisResult
                  isAuthentic={result?.isAuthentic ?? false}
                  confidence={result?.confidence ?? 0}
                  isLoading={isLoading}
                />
              ) : (
                <div className="p-8 rounded-lg border border-border/50 glass-effect text-center flex flex-col items-center justify-center min-h-64">
                  <div className="p-3 rounded-full bg-primary/10 mb-3 animate-glow">
                    <Shield className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Upload an image to see results
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Advanced Detection",
                description:
                  "Cutting-edge technology for precise authenticity analysis",
              },
              {
                title: "Privacy First",
                description:
                  "Your images are processed securely and never stored",
              },
              {
                title: "Instant Results",
                description:
                  "Get detailed analysis and confidence scores in seconds",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border/50 glass-effect hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent mb-4" />
                <h4 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {result && (
        <FeedbackDialog
          open={showFeedback}
          isAuthentic={result.isAuthentic}
          embedding={result.embedding}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </main>
  );
}
