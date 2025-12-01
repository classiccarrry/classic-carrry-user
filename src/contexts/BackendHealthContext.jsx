import { createContext, useContext, useState, useEffect } from 'react';
import BackendErrorPage from '../components/BackendErrorPage';

const BackendHealthContext = createContext();

import API_URL from '../config/api';

export const BackendHealthProvider = ({ children }) => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkBackendHealth();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_URL}/products?limit=1`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsBackendHealthy(true);
      } else {
        setIsBackendHealthy(false);
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isBackendHealthy) {
    return <BackendErrorPage />;
  }

  return (
    <BackendHealthContext.Provider value={{ isBackendHealthy, checkBackendHealth }}>
      {children}
    </BackendHealthContext.Provider>
  );
};

export const useBackendHealth = () => {
  const context = useContext(BackendHealthContext);
  if (!context) {
    throw new Error('useBackendHealth must be used within BackendHealthProvider');
  }
  return context;
};
