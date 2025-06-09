import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardOrders from "./pages/DashboardOrders";
import DashboardProducts from "./pages/DashboardProducts";
import DashboardCustomers from "./pages/DashboardCustomers";
import DashboardReports from "./pages/DashboardReports";
import DashboardReviews from "./pages/DashboardReviews";
import DashboardSettings from "./pages/DashboardSettings";
import RestaurantView from "./pages/RestaurantView";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { realtimeService } from "./integrations/supabase/realtimeService";

const queryClient = new QueryClient();

const App = () => {
  // Configurar tratamento global para erros do Supabase Realtime
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Quando a página fica oculta (usuário muda de aba ou minimiza), cancelar todas as subscrições
        realtimeService.unsubscribeAll();
      }
    };

    // Adicionar listener para quando o usuário mudar de aba
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/orders" element={<DashboardOrders />} />
              <Route path="/dashboard/products" element={<DashboardProducts />} />
              <Route path="/dashboard/customers" element={<DashboardCustomers />} />
              <Route path="/dashboard/reports" element={<DashboardReports />} />
              <Route path="/dashboard/reviews" element={<DashboardReviews />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              <Route path="/dashboard/settings/profile" element={<DashboardSettings />} />
              <Route path="/restaurante/:slug" element={<RestaurantView />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
