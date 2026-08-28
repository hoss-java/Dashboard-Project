// src/contexts/TemplateContext.tsx

import React, { createContext, useContext, useState } from 'react';

interface TemplateContextType {
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <TemplateContext.Provider value={{ showGuide, setShowGuide }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within TemplateProvider');
  }
  return context;
}
