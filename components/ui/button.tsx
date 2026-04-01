import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] motion-reduce:transition-colors motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        default:
          "bg-[#EF4765] text-white shadow-soft text-sm lg:text-base hover:bg-pink-600/90 hover:shadow-soft-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:shadow-soft-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        outline:
          "border-2 border-border-soft bg-background shadow-sm hover:border-maroon/40 hover:bg-cream/50 hover:text-maroon hover:shadow-soft-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        secondary:
          "bg-white border-2 border-[#EADDDD] text-base font-semibold text-[#EF4765] shadow-soft hover:border-[#F77705] hover:bg-[#EF4765] hover:text-white hover:shadow-soft-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm active:scale-100",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
        dark: "bg-white border-2 border-[#EADDDD] text-base font-semibold text-dark-mmm shadow-soft hover:border-dark-mmm hover:bg-dark-mmm hover:text-white hover:shadow-soft-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        dot: "text-xl text-dark-mmm active:scale-100",
      },
      size: {
        secondary: "h-11 px-4 py-2",
        default: "h-8 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-11 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
