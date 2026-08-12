"use client";

import dynamic from "next/dynamic";

const ContactPlatformGame = dynamic(
  () => import("@components/contact/ContactPlatformGame"),
  { ssr: false },
);

export default function ContactGameClient() {
  return <ContactPlatformGame />;
}
