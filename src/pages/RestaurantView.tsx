
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
              Carrinho (0)
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
                <Badge variant="secondary" className="cursor-pointer">Todos</Badge>
                <Badge variant="outline" className="cursor-pointer">Entradas</Badge>
                <Badge variant="outline" className="cursor-pointer">Pratos Principais</Badge>
                <Badge variant="outline" className="cursor-pointer">Sobremesas</Badge>
                <Badge variant="outline" className="cursor-pointer">Bebidas</Badge>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6">
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
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Carrinho vazio</p>
                  <p className="text-gray-400 text-sm mt-1">Adicione produtos para começar</p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span>R$ 5,00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>R$ 5,00</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white" disabled>
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
