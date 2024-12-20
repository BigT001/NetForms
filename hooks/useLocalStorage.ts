import { useState, useEffect } from 'react';

interface Visit {
  timestamp: string;
  location: string;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // New function to track form visits
  const trackFormVisit = (formId: string | number) => {
    const visitKey = `form_${formId}_visits`;
    const currentVisits = JSON.parse(localStorage.getItem(visitKey) || '[]') as Visit[];
    
    const newVisit: Visit = {
      timestamp: new Date().toISOString(),
      location: typeof window !== "undefined" ? window.location.href : ''
    };

    const updatedVisits = [...currentVisits, newVisit];
    localStorage.setItem(visitKey, JSON.stringify(updatedVisits));
    return updatedVisits;
  };

  // New function to get form visits
  const getFormVisits = (formId: string | number): Visit[] => {
    const visitKey = `form_${formId}_visits`;
    return JSON.parse(localStorage.getItem(visitKey) || '[]');
  };

  return [storedValue, setValue, trackFormVisit, getFormVisits] as const;
}
