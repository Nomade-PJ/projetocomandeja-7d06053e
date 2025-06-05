
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, Search, Star, Clock, MapPin } from "lucide-react";

const RestaurantView = () => {
  const { slug } = useParams();
  const [cart, setCart] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Mock categories and products data - these would come from the database
  const categories = [
    { id: "todos", name: "Todos", count: 0 },
    { id: "entradas", name: "Entradas", count: 0 },
    { id: "pratos-principais", name: "Pratos Principais", count: 0 },
    { id: "sobremesas", name: "Sobremesas", count: 0 },
    { id: "bebidas", name: "Bebidas", count: 0 },
  ];

  const products = [
    // Mock products would be here - these would come from the database
  ];

  const addToCart = (product: any) => {
    // TODO: Implement add to cart logic
    console.log("Adding to cart:", product);
  };

  const removeFromCart = (productId: string) => {
    // TODO: Implement remove from cart logic
    console.log("Removing from cart:", productId);
  };

  const getCartItemQuantity = (productId: string) => {
    // TODO: Implement get cart item quantity logic
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CJ</span>
              </div>
              <span className="font-semibold gradient-text">ComandeJá</span>
            </div>
            <Button className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrinho ({cart.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant Banner */}
      <div className="bg-gradient-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Restaurante Demo</h1>
              <p className="text-xl mb-6 text-white/90">
                Deliciosos pratos preparados com ingredientes frescos e muito amor.
              </p>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>0.0 (0 avaliações)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>30-45 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Taxa: R$ 5,00</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-64 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white/60">Logo do Restaurante</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Nosso Cardápio</h2>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Badge 
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6">
              {products.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">Nenhum produto disponível</p>
                      <p className="text-gray-400 text-sm mt-2">Este restaurante ainda não cadastrou produtos</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product: any) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">Sem imagem</span>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                          </div>
                          <Badge variant={product.isActive ? "secondary" : "outline"}>
                            {product.isActive ? "Disponível" : "Indisponível"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              R$ {product.price.toFixed(2)}
                            </span>
                            <p className="text-sm text-gray-500">
                              Preparo: {product.preparationTime} min
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCartItemQuantity(product.id) > 0 ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="mx-2 font-medium">
                                  {getCartItemQuantity(product.id)}
                                </span>
                                <Button 
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                  className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Button 
                                onClick={() => addToCart(product)}
                                className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                                disabled={!product.isActive}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Seu Pedido
                </CardTitle>
                <CardDescription>
                  Revise seus itens antes de finalizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Carrinho vazio</p>
                    <p className="text-gray-400 text-sm mt-1">Adicione produtos para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.quantity}x R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button 
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span>R$ 5,00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>R$ {(cartTotal + 5).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white" 
                    disabled={cart.length === 0}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;
