import { cva } from "class-variance-authority"

// min-h-11 is 44px, the smallest touch target DESIGN.md allows.
export const button = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-crisp px-4 font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      tone: {
        primary: "bg-deep-current text-foam hover:opacity-90",
        secondary: "border border-muted bg-surface-white text-ink hover:bg-bg-deep",
        // White on alarm-coral-text is 6.95:1 (DESIGN.md, rechecked with contrast-check.py).
        danger: "bg-alarm-coral-text text-white hover:opacity-90",
      },
    },
    defaultVariants: { tone: "primary" },
  },
)

// The border is muted, not foam-line: an input edge is a control boundary and needs
// 3:1 against the panel, which foam-line (1.26:1) does not reach.
export const input =
  "min-h-11 w-full rounded-crisp border border-muted bg-surface-white px-3 text-ink aria-[invalid=true]:border-alarm-coral-text"

export const panel = "rounded-panel border border-foam-line bg-surface-white p-5 sm:p-6"
