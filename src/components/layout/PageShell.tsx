import type { ReactNode } from "react";

export const PAGE_PADDING_X = "px-4 md:px-12";
export const PAGE_PADDING_Y = "py-4 sm:py-6 md:py-8";
export const PAGE_PADDING = `${PAGE_PADDING_X} ${PAGE_PADDING_Y}`;

/** Matches Tailwind `px-4` / `md:px-12` used by page titles */
export const PAGE_PADDING_X_PX = 16;
export const PAGE_PADDING_MD_X_PX = 48;
export const PAGE_PADDING_MD_BREAKPOINT_PX = 768;

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({
  children,
  className = "",
}: PageShellProps) {
  return (
    <div className={`flex-1 min-h-0 overflow-y-auto ${className}`.trim()}>
      <div className={PAGE_PADDING}>{children}</div>
    </div>
  );
}
