export type ContactCredit = {
  role: string;
  line?: string;
  href?: string;
};

export const CONTACT_CREDITS: ContactCredit[] = [
  {
    role: "Name",
    line: "Soojin Kim",
  },
  {
    role: "Phone",
    line: "+82 1022500789",
  },
  {
    role: "Email",
    href: "soojin.record@gmail.com",
  },
  {
    role: "GitHub",
    href: "https://github.com/onmidnightblue",
  },
  {
    role: "Work",
    line: "Companies and teams I've built with.",
  },
  {
    role: "Skill",
    line: "Companies and teams I've built with.",
  },
];
