// components/ui/NewToast.tsx
import * as React from "react";
import { X } from "lucide-react";

interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({
  id,
  title,
  description,
  open = true,
  onOpenChange,
  actionLabel,
  onAction,
}: ToastProps) {
  if (!open) return null;

  return (
    <div
      key={id}
      className="fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && (
          <div className="text-sm mt-1 opacity-90">{description}</div>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          {actionLabel}
        </button>
      )}

      <button
        onClick={() => onOpenChange?.(false)}
        className="ml-2 text-gray-400 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}
