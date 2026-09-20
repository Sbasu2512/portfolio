import { createContext, useContext, useMemo, type ReactNode } from "react";
import raw from "@/data/info.json";
import type { PortfolioInfo, WorkExperience } from "@/types/portfolio";
import { useRegion } from "@/hooks/useRegion";

const info = raw as unknown as PortfolioInfo;

interface DataContextValue {
  info: PortfolioInfo;
  phoneNumber: string;
  /** Work experience with India-based on-site locations relabelled "Remote". */
  workExperience: WorkExperience[];
}

const DataContext = createContext<DataContextValue | null>(null);

const INDIA_HINTS = ["india", ", in", "chennai", "bangalore", "bengaluru", "kolkata"];

function isIndiaLocation(location: string): boolean {
  const l = location.toLowerCase();
  return INDIA_HINTS.some((hint) => l.includes(hint));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const region = useRegion();

  const value = useMemo<DataContextValue>(() => {
    const phoneNumber = region === "us-ca" ? info.locale.na_phone : info.locale.default_phone;

    const workExperience = info.work_experience.map((role) =>
      isIndiaLocation(role.location)
        ? { ...role, location: info.locale.india_remote_note }
        : role
    );

    return { info, phoneNumber, workExperience };
  }, [region]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
