
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp } from "lucide-react";
import ExportReportModal from "@/components/dashboard/modals/ExportReportModal";

const DashboardReports = () => {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleViewDetails = (reportType: string) => {
    // TODO: Implement view details logic
    console.log("Viewing details for:", reportType);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
                  <p className="text-muted-foreground">
                    Análises detalhadas do seu restaurante
                  </p>
                </div>
                <Button 
                  className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Vendas
                    </CardTitle>
                    <CardDescription>Relatório de vendas por período</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">R$ 0,00</div>
                      <p className="text-xs text-muted-foreground">Total de vendas</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails("sales")}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Produtos
                    </CardTitle>
                    <CardDescription>Produtos mais vendidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Produtos vendidos</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails("products")}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Clientes
                    </CardTitle>
                    <CardDescription>Análise de clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">Clientes ativos</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails("customers")}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                  <CardDescription>
                    Gere relatórios detalhados para análise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nenhum dado para relatório</p>
                    <p className="text-gray-400 text-sm mt-2">Os relatórios aparecerão quando houver vendas</p>
                    <Button 
                      className="mt-4 bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                      onClick={() => setShowExportModal(true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Gerar Primeiro Relatório
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ExportReportModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal} 
      />
    </SidebarProvider>
  );
};

export default DashboardReports;
