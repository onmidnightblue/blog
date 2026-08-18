"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  pageTitle?: string;
  pageDescription?: string;
  backLink: { href: string; label: string };
  formId: string;
  submitButtonLabel: string;
  isSubmitting: boolean;
  innerClassName?: string;
  marginBottom?: string;
};

export default function AdminEditorHeader({
  pageTitle,
  pageDescription,
  backLink,
  formId,
  submitButtonLabel,
  isSubmitting,
  innerClassName = "",
  marginBottom = "mb-8",
}: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const [showFixedBar, setShowFixedBar] = useState(false);

  useEffect(() => {
    const target = headerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedBar(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const renderActions = (isFixed: boolean) => (
    <>
      <Link
        href={backLink.href}
        tabIndex={isFixed && !showFixedBar ? -1 : 0}
        className="rounded-md border border-foreground/15 px-4 py-2 text-sm text-foreground-muted md:transition-colors md:duration-300 md:hover:border-foreground/30 md:hover:text-foreground"
      >
        {backLink.label}
      </Link>
      <button
        type="submit"
        form={formId}
        disabled={isSubmitting}
        tabIndex={isFixed && !showFixedBar ? -1 : 0}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50 md:transition-colors md:duration-300 md:hover:bg-foreground/90"
      >
        {submitButtonLabel}
      </button>
    </>
  );

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-30 border-b border-foreground/5 bg-background px-4 py-3 transition-opacity duration-200 md:px-8 ${
          showFixedBar
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showFixedBar}
      >
        <div className={`flex items-center justify-end gap-2 ${innerClassName}`}>
          {renderActions(true)}
        </div>
      </div>

      <header
        ref={headerRef}
        className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${marginBottom} ${innerClassName}`}
      >
        <div>
          {pageTitle ? (
            <h1 className="font-paperozi text-3xl font-bold text-foreground">
              {pageTitle}
            </h1>
          ) : null}
          {pageDescription ? (
            <p className="mt-2 text-sm text-foreground-muted">{pageDescription}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">{renderActions(false)}</div>
      </header>
    </>
  );
}
