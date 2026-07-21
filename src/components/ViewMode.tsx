"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ViewModeInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const view = searchParams.get("view");
    const root = document.documentElement;

    if (view === "mobile" || view === "desktop") {
      root.dataset.view = view;
    } else {
      delete root.dataset.view;
    }

    // Keep the attribute honest when users use back/forward
    return () => {
      /* leave dataset for next navigation; next effect re-applies */
    };
  }, [searchParams, pathname]);

  return null;
}

/**
 * Reads ?view=mobile | ?view=desktop and sets html[data-view] for CSS overrides.
 */
export function ViewMode() {
  return (
    <Suspense fallback={null}>
      <ViewModeInner />
    </Suspense>
  );
}
