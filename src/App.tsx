import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider, useData } from "@/context/DataContext";
import { AudioProvider } from "@/context/AudioContext";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import Loader from "@/components/Loader/Loader";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import WorkExperiencePage from "@/pages/WorkExperiencePage";
import EducationPage from "@/pages/EducationPage";
import ProjectsPage from "@/pages/ProjectsPage";
import SkillsPage from "@/pages/SkillsPage";
import ResumePage from "@/pages/ResumePage";

// Maps a nav entry's `id` (from info.json) to the page it routes to.
// Add a new page here and a matching entry to info.nav — nothing else
// needs to change for it to appear, evenly spaced, in the nav bar.
const PAGES: Record<string, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  work: WorkExperiencePage,
  education: EducationPage,
  projects: ProjectsPage,
  skills: SkillsPage,
  resume: ResumePage,
};

function AppRoutes() {
  const { info } = useData();
  return (
    <Routes>
      {info.nav.map((item) => {
        const Page = PAGES[item.id];
        if (!Page || !item.path) return null;
        return <Route key={item.id} path={item.path} element={<Page />} />;
      })}
      {/* Reachable from the resume icon in the hero, not from the nav bar
          itself — matches the Figma design, where it isn't a nav link. */}
      <Route path="/resume" element={<ResumePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppShell() {
  const [loaded, setLoaded] = useState(false);

  return (
    <DataProvider>
      <AudioProvider>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
        {loaded && (
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        )}
      </AudioProvider>
    </DataProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}
