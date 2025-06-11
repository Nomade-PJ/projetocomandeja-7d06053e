import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  // Group items by restaurant
  const itemsByRestaurant: Record<string, CartItem[]> = items.reduce((acc, item) => {
    if (!acc[item.restaurant_id]) {
      acc[item.restaurant_id] = [];
    }
    acc[item.restaurant_id].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Seu Carrinho</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Seu carrinho está vazio</h3>
              <p className="text-gray-500 mt-1 max-w-xs">
                Adicione itens ao seu carrinho para continuar
              </p>
              <Button onClick={onClose} className="mt-6">
                Continuar comprando
              </Button>
            </div>
          ) : (
            <>
              {Object.entries(itemsByRestaurant).map(([restaurantId, restaurantItems]) => (
                <div key={restaurantId} className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Restaurante {restaurantId.substring(0, 8)}...
                  </h3>
                  <div className="space-y-4">
                    {restaurantItems.map((item) => (
                      <div key={item.id} className="flex gap-3 border-b pb-4">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-gray-500 text-sm mb-2">
                            {formatCurrency(item.price)}
                          </p>
                          
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            
                            <div className="ml-auto font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-bold">{formatCurrency(getTotal())}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Limpar carrinho
              </Button>
              <Button>
                Finalizar pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 