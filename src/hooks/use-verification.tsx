
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VerificationContextType {
  isPanVerified: boolean;
  isAadhaarVerified: boolean;
  isVerified: boolean;
  isLoading: boolean;
  setPanVerified: (isVerified: boolean) => void;
  setAadhaarVerified: (isVerified: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const panStatus = localStorage.getItem('isPanVerified') === 'true';
      const aadhaarStatus = localStorage.getItem('isAadhaarVerified') === 'true';
      setIsPanVerified(panStatus);
      setIsAadhaarVerified(aadhaarStatus);
    } catch (error) {
      console.error('Failed to read verification status from localStorage', error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSetPanVerified = (verified: boolean) => {
    setIsPanVerified(verified);
    try {
        localStorage.setItem('isPanVerified', verified.toString());
    } catch (error) {
        console.error('Failed to save PAN verification status to localStorage', error);
    }
  };

  const handleSetAadhaarVerified = (verified: boolean) => {
    setIsAadhaarVerified(verified);
     try {
        localStorage.setItem('isAadhaarVerified', verified.toString());
    } catch (error) {
        console.error('Failed to save Aadhaar verification status to localStorage', error);
    }
  };

  const isVerified = isPanVerified && isAadhaarVerified;

  return (
    <VerificationContext.Provider value={{ isPanVerified, isAadhaarVerified, isVerified, isLoading, setPanVerified: handleSetPanVerified, setAadhaarVerified: handleSetAadhaarVerified }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
