
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Garden from "./pages/Garden";
import Journal from "./pages/Journal";
import Activity from "./pages/Activity";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/layout/BottomNav";
import SplashScreen from "./components/layout/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Vérifier si l'utilisateur a déjà vu le splash screen dans la session actuelle
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <main className="min-h-screen max-w-lg mx-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/garden" replace />} />
              <Route path="/garden" element={<Garden />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
