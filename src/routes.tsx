import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomeScroll } from './features/home/HomeScroll';
import { ProjectCaseStudy } from './features/projects/ProjectCaseStudy';
import { Text } from './components/Text';
import { Button } from './components/Button';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScroll />} />
      <Route path="/projects/flowsync" element={<ProjectCaseStudy />} />
      
      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center select-none bg-surface-bg">
            <Text variant="subheading" className="text-lg font-bold">
              [ 404 // ROUTE_NOT_FOUND ]
            </Text>
            <Text variant="body" className="text-xs text-text-muted mt-2 max-w-xs leading-relaxed">
              The requested route is outside the active systems schematic.
            </Text>
            <Button variant="primary" to="/" className="mt-6">
              Return to Hub
            </Button>
          </div>
        }
      />
    </Routes>
  );
};
