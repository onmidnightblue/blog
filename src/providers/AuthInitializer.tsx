"use client";

import { useAnonymousUserInit } from "@hooks";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAnonymousUserInit();
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-gray-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
