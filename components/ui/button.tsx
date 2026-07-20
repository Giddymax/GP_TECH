import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-ink shadow-[0_1px_2px_rgba(19,36,46,0.08),0_10px_24px_-8px_rgba(43,179,185,0.55)] hover:bg-accent-dark hover:shadow-[0_1px_2px_rgba(19,36,46,0.1),0_14px_32px_-8px_rgba(43,179,185,0.65)] hover:-translate-y-0.5",
        dark: "bg-ink text-off-white shadow-[0_1px_2px_rgba(19,36,46,0.2),0_10px_24px_-8px_rgba(19,36,46,0.5)] hover:bg-navy hover:-translate-y-0.5",
        outline:
          "border border-line bg-transparent text-ink hover:border-accent hover:text-accent-dark",
        ghost: "bg-transparent text-ink hover:bg-blue-light",
        whatsapp:
          "bg-[#25D366] text-ink shadow-[0_1px_2px_rgba(19,36,46,0.1),0_10px_24px_-8px_rgba(37,211,102,0.6)] hover:brightness-95 hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
