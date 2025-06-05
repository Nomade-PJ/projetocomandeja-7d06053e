
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, FolderPlus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import NewProductModal from "@/components/dashboard/modals/NewProductModal";
import NewCategoryModal from "@/components/dashboard/modals/NewCategoryModal";
import FiltersModal from "@/components/dashboard/modals/FiltersModal";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const DashboardProducts = () => {
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            <div className="flex-1 p-6">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowNewCategoryModal(true)}
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Criar Categoria
                  </Button>
                  <Button 
                    className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                    onClick={() => setShowNewProductModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
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
                    <div className="text-3xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">produtos cadastrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {products.filter(p => p.is_active).length}
                    </div>
                    <p className="text-xs text-muted-foreground">produtos disponíveis</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categorias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{categories.length}</div>
                    <p className="text-xs text-muted-foreground">categorias criadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Em Destaque</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {products.filter(p => p.is_featured).length}
                    </div>
                    <p className="text-xs text-muted-foreground">produtos em destaque</p>
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
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        {products.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado"}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {products.length === 0 ? "Comece criando categorias e produtos" : "Tente ajustar sua busca"}
                      </p>
                      {products.length === 0 && (
                        <div className="flex items-center justify-center gap-4 mt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setShowNewCategoryModal(true)}
                          >
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Criar Categoria
                          </Button>
                          <Button 
                            className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                            onClick={() => setShowNewProductModal(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Primeiro Produto
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => {
                        const category = categories.find(c => c.id === product.category_id);
                        return (
                          <Card key={product.id} className="relative group">
                            <CardContent className="p-4">
                              {product.image_url && (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-32 object-cover rounded-md mb-3"
                                />
                              )}
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-semibold text-lg">{product.name}</h3>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-2xl font-bold text-brand-600">
                                  {formatPrice(product.price)}
                                </p>
                                {product.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {product.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  {category && (
                                    <Badge variant="secondary">{category.name}</Badge>
                                  )}
                                  {product.is_featured && (
                                    <Badge className="bg-yellow-100 text-yellow-800">Destaque</Badge>
                                  )}
                                  <Badge variant={product.is_active ? "default" : "destructive"}>
                                    {product.is_active ? "Ativo" : "Inativo"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Preparo: {product.preparation_time} min
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
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
      <NewCategoryModal 
        open={showNewCategoryModal} 
        onOpenChange={setShowNewCategoryModal} 
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
