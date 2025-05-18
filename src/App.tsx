
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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

export default App;
