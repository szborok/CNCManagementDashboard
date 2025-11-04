import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface ValidationFeedbackProps {
  isValid: boolean;
  error?: string;
  warning?: string;
  className?: string;
}

export default function ValidationFeedback({
  isValid,
  error,
  warning,
  className = "",
}: ValidationFeedbackProps) {
  if (!error && !warning && isValid) {
    return (
      <div
        className={`flex items-center gap-1 text-green-600 text-sm ${className}`}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>Valid</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-start gap-2 text-red-600 text-sm ${className}`}
      >
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (warning) {
    return (
      <div
        className={`flex items-start gap-2 text-yellow-600 text-sm ${className}`}
      >
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>{warning}</span>
      </div>
    );
  }

  return null;
}
