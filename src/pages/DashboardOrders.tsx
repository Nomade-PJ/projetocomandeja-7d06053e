
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const DashboardOrders = () => {
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
                  <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
                  <p className="text-muted-foreground">
                    Gerencie todos os pedidos do seu restaurante
                  </p>
                </div>
                <Button className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar pedidos..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Pedidos</CardTitle>
                  <CardDescription>
                    Acompanhe o status dos seus pedidos em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
                    <p className="text-gray-400 text-sm mt-2">Os pedidos aparecerão aqui quando forem realizados</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardOrders;
