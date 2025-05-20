
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
import { notificationService } from "./services/NotificationService";
import { stepTrackerService } from "./services/StepTrackerService";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [servicesInitialized, setServicesInitialized] = useState(false);
  
  // Vérifier si l'utilisateur a déjà vu le splash screen dans la session actuelle
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      setShowSplash(false);
    }

    // Initialiser les services natifs (notifications, suivi de pas)
    const initServices = async () => {
      try {
        // Vérifier si les API Capacitor sont disponibles (environnement mobile)
        const isCapacitorAvailable = 
          typeof (window as any).Capacitor !== 'undefined' && 
          (window as any).Capacitor.isPluginAvailable;
        
        if (isCapacitorAvailable) {
          // Initialiser les notifications
          await notificationService.checkPermissions().then(status => {
            if (status.display !== 'granted') {
              setTimeout(() => {
                toast.info("Activez les notifications pour recevoir des rappels", {
                  action: {
                    label: "Activer",
                    onClick: () => notificationService.initLocalNotifications()
                  }
                });
              }, 2000);
            }
          });
          
          // Démarrer le suivi des pas en arrière-plan
          await stepTrackerService.startTracking();
          
          console.log("Services natifs initialisés avec succès");
        } else {
          console.log("Environnement non-mobile détecté, services natifs non initialisés");
        }
        
        setServicesInitialized(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation des services natifs:", error);
        setServicesInitialized(true); // Continuer malgré l'erreur
      }
    };
    
    initServices();
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
