import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Clock, MapPin, Search, Phone, Instagram, Facebook, ChevronDown, Info, Heart, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { AuthModal } from '@/components/ui/auth-modal';
import { UserMenu } from '@/components/ui/user-menu';
import { formatCurrency } from '@/lib/utils';
import { Restaurant, Category, Product } from '@/types';

const RestaurantView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { addItem, getItemCount, toggleFavorite, isFavorite } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (slug) {
      fetchRestaurantData();
    }
  }, [slug]);

  const fetchRestaurantData = async () => {
    try {
      console.log('Buscando restaurante com slug:', slug);
      
      // Buscar dados do restaurante
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (restaurantError) {
        console.error('Error fetching restaurant:', restaurantError);
        return;
      }

      if (!restaurantData) {
        console.log('Restaurante não encontrado para slug:', slug);
        setLoading(false);
        return;
      }

      console.log('Restaurante encontrado:', restaurantData);
      setRestaurant(restaurantData);

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantData.id)
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else {
        console.log('Categorias encontradas:', categoriesData);
        setCategories(categoriesData || []);
      }

      // Buscar produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurantData.id)
        .eq('is_active', true)
        .order('display_order');

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        console.log('Produtos encontrados:', productsData);
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent card click from triggering
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      restaurant_id: product.restaurant_id
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
      duration: 2000,
    });
  };

  const handleToggleFavorite = () => {
    if (!user) {
      // Se não estiver logado, abrir modal de autenticação
      setIsAuthModalOpen(true);
      return;
    }
    
    if (restaurant) {
      toggleFavorite(restaurant.id);
      
      toast({
        title: isFavorite(restaurant.id) ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `${restaurant.name} foi ${isFavorite(restaurant.id) ? "removido dos" : "adicionado aos"} favoritos.`,
        duration: 2000,
      });
    }
  };

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category_id === selectedCategory) && 
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const featuredProducts = products.filter(product => product.is_featured);

  // Update the product cards to be clickable
  // This is for the featured products section
  const renderFeaturedProductCard = (product: Product) => (
    <Card 
      key={product.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
      onClick={() => handleProductClick(product.id)}
    >
      <div className="relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary text-white">
          Destaque
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(product.price)}
          </p>
        </div>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.preparation_time} min
          </span>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white"
            style={{ backgroundColor: primaryColor }}
            onClick={(e) => handleAddToCart(product, e)}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // This is for the category products section
  const renderProductCard = (product: Product) => (
    <Card 
      key={product.id} 
      className="overflow-hidden hover:shadow-lg transition-shadow group border border-gray-200 cursor-pointer"
      onClick={() => handleProductClick(product.id)}
    >
      {product.image_url ? (
        <div className="relative overflow-hidden h-48">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-white">Popular</Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Sem imagem</span>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(product.price)}
          </p>
        </div>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.preparation_time} min
          </span>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white"
            style={{ backgroundColor: primaryColor }}
            onClick={(e) => handleAddToCart(product, e)}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-primary/30 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurante não encontrado</h1>
          <p className="text-gray-600">O restaurante que você está procurando não existe ou está inativo.</p>
          <p className="text-gray-400 text-sm mt-2">Slug buscado: {slug}</p>
        </div>
      </div>
    );
  }

  // Define a cor primária para o tema (poderia vir do banco de dados)
  const primaryColor = '#ff6b35';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Hero com os botões de favorito e carrinho incorporados */}
      <div className="relative">
        {restaurant.banner_url ? (
          <div 
            className="h-24 md:h-32 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${restaurant.banner_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold mb-0 drop-shadow-md">{restaurant.name}</h1>
                <div className="flex items-center space-x-3">
                  {!user ? (
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      <UserCircle className="w-5 h-5 text-white mr-1" />
                      <span className="text-white text-sm">Entrar</span>
                    </button>
                  ) : (
                    <UserMenu className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-1" />
                  )}
                  <button 
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(restaurant.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>
                  <button 
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md relative"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {getItemCount()}
                    </span>
                  </button>
                </div>
              </div>
              {restaurant.description && (
                <p className="text-xs md:text-sm mb-1 max-w-lg drop-shadow-sm line-clamp-1">{restaurant.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary hover:bg-primary/90 px-2 py-0.5 text-xs font-medium">
                  <Star className="w-3 h-3 fill-white mr-1" />
                  <span>4.8</span>
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-2 py-0.5 text-xs font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>30-45 min</span>
                </Badge>
                {restaurant.address && (
                  <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-2 py-0.5 text-xs font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[120px]">{restaurant.address}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-24 md:h-32 bg-gradient-to-r from-primary/90 to-primary/70 relative">
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold mb-0">{restaurant.name}</h1>
                <div className="flex items-center space-x-3">
                  {!user ? (
                    <button 
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      <UserCircle className="w-5 h-5 text-white mr-1" />
                      <span className="text-white text-sm">Entrar</span>
                    </button>
                  ) : (
                    <UserMenu className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-1" />
                  )}
                  <button 
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(restaurant.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                  </button>
                  <button 
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md relative"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {getItemCount()}
                    </span>
                  </button>
                </div>
              </div>
              {restaurant.description && (
                <p className="text-xs md:text-sm mb-1 max-w-lg opacity-90 line-clamp-1">{restaurant.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 text-xs font-medium">
                  <Star className="w-3 h-3 fill-white mr-1" />
                  <span>4.8</span>
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 text-xs font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>30-45 min</span>
                </Badge>
                {restaurant.address && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 text-xs font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[120px]">{restaurant.address}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:ring-primary focus:border-primary rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categorias como Chips rolantes horizontalmente */}
        <div className="mb-8">
          <div className="overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2 min-w-max">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos os Produtos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Produtos em Destaque */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🔥</span> Destaques
              </h2>
              <Button variant="ghost" className="text-gray-600" size="sm">
                Ver todos <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map(renderFeaturedProductCard)}
            </div>
          </div>
        )}

        {/* Lista de Produtos por Categoria */}
        {categories.map((category) => {
          const categoryProducts = filteredProducts.filter(p => p.category_id === category.id);
          if (categoryProducts.length === 0 && selectedCategory !== category.id) return null;

          return (
            <div key={category.id} className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                {categoryProducts.length > 3 && (
                  <Button variant="ghost" className="text-gray-600" size="sm">
                    Ver todos <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                )}
              </div>

              {category.description && (
                <p className="text-gray-600 mb-5">{category.description}</p>
              )}

              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map(renderProductCard)}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Nenhum produto encontrado nesta categoria</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Produtos sem categoria */}
        {(() => {
          const uncategorizedProducts = filteredProducts.filter(p => !p.category_id);
          if (uncategorizedProducts.length === 0) return null;

          return (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Outros Produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uncategorizedProducts.map(renderProductCard)}
              </div>
            </div>
          );
        })()}

        {/* Mensagem quando não há produtos */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">Cardápio em breve</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Este restaurante ainda não adicionou produtos ao cardápio. Volte em breve!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-xl mb-3">{restaurant.name}</h3>
              {restaurant.description && (
                <p className="text-gray-300 mb-4 max-w-md">{restaurant.description}</p>
              )}
              {restaurant.address && (
                <div className="flex items-start mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-gray-300">{restaurant.address}, {restaurant.city}, {restaurant.state}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center mb-2">
                  <Phone className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-300">{restaurant.phone}</span>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-3">Redes Sociais</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} {restaurant.name}. Todos os direitos reservados.</p>
            <p>Desenvolvido com ♥ por Comanda Já</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          toast({
            title: "Login realizado com sucesso!",
            description: "Agora você pode favoritar restaurantes e fazer pedidos.",
            duration: 3000,
          });
        }}
      />

      {/* Adicionar CSS para esconder a scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RestaurantView;
