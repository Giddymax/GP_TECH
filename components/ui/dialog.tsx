"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm data-[state=open]:animate-fade-up" />
      {/* Centered via flexbox on the fixed wrapper, not a transform-based
          top/left-50%+translate — that combination doesn't reflow when the
          on-screen keyboard shrinks the visual viewport on mobile, so a
          focused input can end up covered or the dialog cut off at the top. */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          className={cn(
            "relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-line bg-white p-6 shadow-card-hover focus:outline-none",
            className,
          )}
          {...props}
        >
          {/* min-h-0 overrides this flex child's default min-height:auto —
              without it, the div grows to fit all content instead of
              scrolling, and anything past max-h-[85vh] just gets clipped. */}
          <div className="min-h-0 overflow-y-auto">{children}</div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted transition-colors hover:bg-blue-light hover:text-ink focus-visible:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold text-ink", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("mt-1.5 text-sm text-muted", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription };
