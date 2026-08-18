export const PORTFOLIO_NAV_ITEMS = [
  { href: "/", label: "record" },
  { href: "/project", label: "project" },
  { href: "/contact", label: "contact" },
] as const;

export function isPortfolioNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/board");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
