"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { type JSX } from "react";

import { cn } from "@/utils/cn";

// Core Typography component with variants using class-variance-authority
const typographyVariants = cva("font-nunito", {
  variants: {
    variant: {
      // Headings (font-weight can be overridden via weight prop)
      h1: "text-4xl tracking-tight md:text-5xl lg:text-6xl",
      h2: "text-3xl tracking-tight md:text-4xl",
      h3: "text-2xl tracking-tight md:text-3xl",
      h4: "text-xl md:text-2xl",
      h5: "text-lg md:text-xl",
      h6: "text-base md:text-lg",

      // Body text
      body: "text-base",
      "body-sm": "text-sm",
      "body-xs": "text-xs",
      "body-lg": "text-lg",

      // Display text (for hero sections, etc.)
      display: "text-5xl tracking-tighter md:text-6xl lg:text-7xl",
      "display-lg": "text-6xl tracking-tighter md:text-7xl lg:text-8xl",

      // Special variants
      lead: "text-xl md:text-2xl",
      caption: "text-sm font-medium",
      label: "text-sm font-medium",
      overline: "text-xs uppercase tracking-widest font-semibold",
      code: "font-mono text-sm",
      link: "text-primary hover:underline focus:underline focus:outline-none cursor-pointer",
      blockquote: "pl-4 border-l-4 border-[var(--background-border)] italic",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case",
    },
    decoration: {
      underline: "underline",
      "line-through": "line-through",
      "no-underline": "no-underline",
    },
    truncate: {
      true: "truncate",
      multiline2: "line-clamp-2",
      multiline3: "line-clamp-3",
    },
    color: {
      default: "text-[var(--text-default)]",
      secondary: "text-[var(--text-secondary)]",
      light: "text-[var(--text-light)]",
      muted: "text-[var(--text-muted)]",
      primary: "text-[var(--primary)]",
      accent: "text-[var(--secondary)]",
      tertiary: "text-[var(--tertiary)]",
      success: "text-[var(--success)]",
      warning: "text-amber-600 dark:text-amber-400",
      danger: "text-[var(--error)]",
      info: "text-[var(--toast-info)]",
      white: "text-white",
      black: "text-[var(--text-default)]",
      "black-40": "text-[var(--text-default)]/40",
      "black-70": "text-[var(--text-default)]/70",
      "black-60": "text-[var(--text-default)]/60",
      "black-50": "text-[var(--text-default)]/50",
      "black-80": "text-[var(--text-default)]/80",
      subtle: "text-[var(--text-secondary)]",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    weight: undefined, // No default weight for body
  },
  compoundVariants: [
    // Apply bold as default for headings when no weight is specified
    {
      variant: ["h1", "h2", "h3", "h4", "h5", "h6", "display", "display-lg"],
      weight: undefined,
      class: "font-bold",
    },
  ],
});

// Element mapping for HTML semantics
const elementMap: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  "body-sm": "p",
  "body-xs": "p",
  "body-lg": "p",
  display: "h1",
  "display-lg": "h1",
  lead: "p",
  caption: "span",
  label: "label",
  overline: "span",
  code: "code",
  link: "a",
  blockquote: "blockquote",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof typographyVariants>, "color"> {
  as?: keyof JSX.IntrinsicElements;
  href?: string;
  truncateAfter?: number;
  htmlFor?: string;
  unstyled?: boolean;
  color?:
    | "default"
    | "secondary"
    | "light"
    | "muted"
    | "primary"
    | "accent"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "white"
    | "black"
    | "black-40"
    | "black-50"
    | "black-60"
    | "black-70"
    | "black-80"
    | "subtle";
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = "body",
      weight,
      align,
      transform,
      decoration,
      truncate,
      color,
      as,
      children,
      unstyled,
      ...props
    },
    ref
  ) => {
    // Dynamically determine the element based on variant or explicitly set by 'as'
    const Component = (as ||
      elementMap[variant as string] ||
      "p") as React.ElementType;

    return (
      <Component
        className={cn(
          !unstyled &&
            typographyVariants({
              variant,
              weight,
              align,
              transform,
              decoration,
              truncate,
              color,
            }),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

// Predefined components for common use cases
export const Heading1 = (props: TypographyProps) => (
  <Typography variant="h1" {...props} />
);

export const Heading2 = (props: TypographyProps) => (
  <Typography variant="h2" {...props} />
);

export const Heading3 = (props: TypographyProps) => (
  <Typography variant="h3" {...props} />
);

export const Heading4 = (props: TypographyProps) => (
  <Typography variant="h4" {...props} />
);

export const Heading5 = (props: TypographyProps) => (
  <Typography variant="h5" {...props} />
);

export const Heading6 = (props: TypographyProps) => (
  <Typography variant="h6" {...props} />
);

export const Paragraph = (props: TypographyProps) => (
  <Typography variant="body" {...props} />
);

export const SmallText = (props: TypographyProps) => (
  <Typography variant="body-sm" {...props} />
);

export const LeadText = (props: TypographyProps) => (
  <Typography variant="lead" {...props} />
);

export const CaptionText = (props: TypographyProps) => (
  <Typography variant="caption" {...props} />
);

export const LabelText = (props: TypographyProps) => (
  <Typography variant="label" {...props} />
);

export const LinkText = (props: TypographyProps) => (
  <Typography variant="link" {...props} />
);

export const DisplayText = (props: TypographyProps) => (
  <Typography variant="display" {...props} />
);
