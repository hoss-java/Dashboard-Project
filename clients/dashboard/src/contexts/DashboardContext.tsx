// src/contexts/DashboardContext.tsx

import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <DashboardContext.Provider value={{ showGuide, setShowGuide }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
