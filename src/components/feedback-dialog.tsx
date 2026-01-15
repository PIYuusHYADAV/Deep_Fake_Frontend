"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface FeedbackDialogProps {
  open: boolean;
  isAuthentic: boolean;
  onClose: () => void;
  embedding: number[];
}

export function FeedbackDialog({
  open,
  isAuthentic,
  onClose,
  embedding,
}: FeedbackDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (isCorrect: boolean) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: isCorrect ? (isAuthentic ? 1 : 0) : isAuthentic ? 0 : 1,
          embedding: embedding,
        }),
      });

      if (!response.ok) {
        throw new Error("Network issue from backend");
      }

      console.log(await response.json());
      onClose();
    } catch (error) {
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Was this correct?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 pt-4 animate-fade-in-up">
          <Button
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            className="flex flex-col items-center gap-2 py-6"
            variant="outline"
          >
            <ThumbsUp className="w-6 h-6" />
            <span className="text-sm">Yes</span>
          </Button>

          <Button
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            className="flex flex-col items-center gap-2 py-6"
            variant="outline"
          >
            <ThumbsDown className="w-6 h-6" />
            <span className="text-sm">No</span>
          </Button>
        </div>

        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
