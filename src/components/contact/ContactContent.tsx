import { CONTACT_CREDITS, type ContactCredit } from "@constants";

function resolveCreditHref(credit: ContactCredit): string | null {
  if (credit.href) {
    if (
      credit.href.startsWith("mailto:") ||
      credit.href.startsWith("tel:") ||
      credit.href.startsWith("http")
    ) {
      return credit.href;
    }

    if (credit.href.includes("@")) {
      return `mailto:${credit.href}`;
    }

    return credit.href;
  }

  return null;
}

function resolveCreditLabel(credit: ContactCredit, href: string | null): string {
  if (href) {
    return href.replace(/^mailto:|^tel:/, "");
  }

  return credit.line ?? "";
}

export default function ContactContent() {
  return (
    <div className="flex max-w-md flex-col gap-10">
      {CONTACT_CREDITS.map((credit) => {
        const {role, line, href, } = credit || {}
        return (
          <div key={role} className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-foreground-muted">
              {role}
            </p>
            {line ? (
              <p className="text-sm leading-relaxed text-foreground">{line}</p>
            ) : null}
            {href && (
              <a
                href={href}
                target={"_blank"}
                rel={"noreferrer noopener"}
                className="text-sm text-link underline underline-offset-4 md:transition-colors md:duration-300 md:hover:text-link-hover"
              >
                {href}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
