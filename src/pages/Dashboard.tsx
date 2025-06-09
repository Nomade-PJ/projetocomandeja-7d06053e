import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [realtimeError, setRealtimeError] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Função para lidar com erros de conexão Realtime
  const handleReload = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-4">
            {realtimeError && (
              <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Problemas na conexão</AlertTitle>
                <AlertDescription className="text-yellow-700 flex items-center justify-between">
                  <span>Estamos com dificuldades para obter dados em tempo real.</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                    onClick={handleReload}
                    disabled={retrying}
                  >
                    {retrying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reconectando...
                      </>
                    ) : (
                      'Tentar novamente'
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <DashboardOverview onRealtimeError={() => setRealtimeError(true)} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
