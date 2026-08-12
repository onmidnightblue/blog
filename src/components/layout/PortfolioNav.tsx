"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { PORTFOLIO_NAV_ITEMS } from "@constants";

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 7H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 12H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 17H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PortfolioNav = ({ footer }: { footer?: ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-background border-b border-foreground/10">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
          className="flex items-center justify-center w-10 h-10 -ml-2"
        >
          <HamburgerIcon />
        </button>
        <span className="font-paperozi font-bold text-lg text-foreground">
          Deep Blue Board
        </span>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="md:hidden fixed inset-0 z-40 bg-black/40 animate-fade-in"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex flex-col h-dvh w-60 p-6 bg-background border-r border-foreground/10 transition-transform duration-300 ease-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="md:hidden flex items-center justify-between mb-8">
          <span className="font-paperozi font-bold text-lg text-foreground">
            Deep Blue Board
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex items-center justify-center w-10 h-10 -mr-2"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="hidden md:block mb-12">
          <Link href="/" className="font-paperozi font-bold text-2xl text-foreground">
            Deep Blue Board
          </Link>
          <p className="mt-2 text-sm text-foreground-muted">onmidnightblue</p>
        </div>

        <nav className="flex flex-col gap-1">
          {PORTFOLIO_NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`px-3 py-2.5 rounded-md text-sm font-medium capitalize ${
                isActive(href)
                  ? "bg-foreground text-background"
                  : "text-foreground-muted md:hover:text-foreground md:hover:bg-foreground/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {footer && <div className="mt-auto pt-6">{footer}</div>}
      </aside>
    </>
  );
};

export default PortfolioNav;
