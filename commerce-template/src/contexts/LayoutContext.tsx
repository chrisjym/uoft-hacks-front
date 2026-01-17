import React, { createContext, useContext } from "react";
import { useLayoutState as useLayoutStateInternal } from "@/hooks/useLayoutState";

type LayoutContextValue = ReturnType<typeof useLayoutStateInternal>;

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const layout = useLayoutStateInternal();
  return <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within <LayoutProvider>");
  return ctx;
}
