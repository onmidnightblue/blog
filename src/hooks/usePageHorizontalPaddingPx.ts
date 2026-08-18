"use client";

import { useEffect, useState } from "react";
import {
  PAGE_PADDING_MD_BREAKPOINT_PX,
  PAGE_PADDING_MD_X_PX,
  PAGE_PADDING_X_PX,
} from "@components/layout/PageShell";

export function usePageHorizontalPaddingPx() {
  const [paddingPx, setPaddingPx] = useState(PAGE_PADDING_X_PX);

  useEffect(() => {
    const media = window.matchMedia(
      `(min-width: ${PAGE_PADDING_MD_BREAKPOINT_PX}px)`,
    );

    const sync = () => {
      setPaddingPx(media.matches ? PAGE_PADDING_MD_X_PX : PAGE_PADDING_X_PX);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return paddingPx;
}
