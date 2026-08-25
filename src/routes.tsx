import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomeScroll } from './features/home/HomeScroll';
import { ConnectPage } from './features/home/ConnectPage';
import { ProjectCaseStudy } from './features/projects/ProjectCaseStudy';
import { ProjectsArchive } from './features/projects/ProjectsArchive';
import { AeroFindCaseStudy } from './features/projects/AeroFindCaseStudy';
import { WealthTrackCaseStudy } from './features/projects/WealthTrackCaseStudy';
import { IntelliRAGCaseStudy } from './features/projects/IntelliRAGCaseStudy';
import { PortfolioCaseStudy } from './features/projects/PortfolioCaseStudy';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScroll />} />
      <Route path="/connect" element={<ConnectPage />} />
      <Route path="/projects" element={<ProjectsArchive />} />
      <Route path="/projects/flowsync" element={<ProjectCaseStudy />} />
      <Route path="/projects/aerofind" element={<AeroFindCaseStudy />} />
      <Route path="/projects/wealthtrack" element={<WealthTrackCaseStudy />} />
      <Route path="/projects/intellirag" element={<IntelliRAGCaseStudy />} />
      <Route path="/projects/portfolio" element={<PortfolioCaseStudy />} />
      
      {/* Fallback archive list for undocumented routes */}
      <Route path="*" element={<ProjectsArchive />} />
    </Routes>
  );
};
