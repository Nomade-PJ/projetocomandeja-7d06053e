import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import NewProductModal from "@/components/dashboard/modals/NewProductModal";
import FiltersModal from "@/components/dashboard/modals/FiltersModal";

const DashboardProducts = () => {
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log("Searching for:", searchQuery);
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
                  <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
                  <p className="text-muted-foreground">
                    Gerencie o cardápio do seu restaurante
                  </p>
                </div>
                <Button 
                  className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                  onClick={() => setShowNewProductModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>

              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowFiltersModal(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total de Produtos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">produtos cadastrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">produtos disponíveis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categorias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">categorias criadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mais Vendido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">nenhum produto</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Produtos</CardTitle>
                  <CardDescription>
                    Gerencie todos os produtos do seu cardápio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum produto cadastrado</p>
                    <p className="text-gray-400 text-sm mt-2">Comece criando seu primeiro produto</p>
                    <Button 
                      className="mt-4 bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                      onClick={() => setShowNewProductModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Produto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <NewProductModal 
        open={showNewProductModal} 
        onOpenChange={setShowNewProductModal} 
      />
      <FiltersModal 
        open={showFiltersModal} 
        onOpenChange={setShowFiltersModal}
        type="products"
      />
    </SidebarProvider>
  );
};

export default DashboardProducts;
