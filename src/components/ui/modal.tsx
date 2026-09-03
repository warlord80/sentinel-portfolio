"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Accessible modal built on the native <dialog> element (PRD §44).
 * Keyboard (Esc), focus management and backdrop handling are native + localized.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto rounded-md border border-line bg-surface p-6 text-foreground backdrop:bg-background/80",
        className,
      )}
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {title && (
        <h2
          id="modal-title"
          className="mb-4 font-display text-2xl font-medium tracking-tight"
        >
          {title}
        </h2>
      )}
      {children}
    </dialog>
  );
}
