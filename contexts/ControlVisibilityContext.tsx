"use client"

import React, { createContext, useState, useContext } from 'react';

type ControlVisibilityContextType = {
  isControlVisible: boolean;
  toggleControl: () => void;
};

const ControlVisibilityContext = createContext<ControlVisibilityContextType | undefined>(undefined);

export const ControlVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isControlVisible, setIsControlVisible] = useState(true);

  const toggleControl = () => {
    setIsControlVisible(prev => !prev);
  };

  return (
    <ControlVisibilityContext.Provider value={{ isControlVisible, toggleControl }}>
      {children}
    </ControlVisibilityContext.Provider>
  );
};

export const useControlVisibility = () => {
  const context = useContext(ControlVisibilityContext);
  if (context === undefined) {
    throw new Error('useControlVisibility must be used within a ControlVisibilityProvider');
  }
  return context;
};
