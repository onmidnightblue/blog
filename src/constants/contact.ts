export type ContactTargetId =
  | "person"
  | "medal"
  | "building"
  | "phone"
  | "letter"
  | "github";

export type ContactTarget = {
  id: ContactTargetId;
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

export const CONTACT_TARGETS: ContactTarget[] = [
  {
    id: "person",
    label: "About",
    description: "Who I am and what I do.",
    href: "https://github.com",
    external: true,
  },
  {
    id: "medal",
    label: "Highlights",
    description: "Awards and milestones worth sharing.",
    href: "https://github.com",
    external: true,
  },
  {
    id: "building",
    label: "Work",
    description: "Companies and teams I've built with.",
    href: "https://github.com",
    external: true,
  },
  {
    id: "phone",
    label: "Phone",
    description: "Call or message when timing matters.",
    href: "tel:+82000000000",
  },
  {
    id: "letter",
    label: "Email",
    description: "Drop a note — I read every message.",
    href: "mailto:hello@example.com",
  },
  {
    id: "github",
    label: "GitHub",
    description: "Repos, contributions, and side projects.",
    href: "https://github.com",
    external: true,
  },
];

export const CONTACT_TARGET_MAP = Object.fromEntries(
  CONTACT_TARGETS.map((target) => [target.id, target]),
) as Record<ContactTargetId, ContactTarget>;
