import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Store, Bell, CreditCard, Settings, Store as StoreIcon, User, Image, Instagram, Facebook, Twitter, Globe, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardSettings = () => {
  const { toast } = useToast();
  const { restaurant, loading, createRestaurant, updateRestaurant } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Restaurant info state
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  
  // Order settings state
  const [deliveryFee, setDeliveryFee] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryRadius, setDeliveryRadius] = useState("");
  
  // Notification settings state
  const [newOrderNotifications, setNewOrderNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [acceptOrders, setAcceptOrders] = useState(true);

  // Profile settings state
  const [logo, setLogo] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  // Define qual aba deve estar ativa com base na URL
  const getDefaultTab = () => {
    if (location.pathname.includes("/profile")) {
      return "profile";
    }
    return "restaurant-info";
  };

  // Carregar dados do restaurante quando disponíveis
  useEffect(() => {
    if (restaurant) {
      setRestaurantName(restaurant.name || "");
      setPhone(restaurant.phone || "");
      setDescription(restaurant.description || "");
      setAddress(restaurant.address || "");
      setLogo(restaurant.logo_url || "");
      
      // Carregar dados de redes sociais se existirem
      if (restaurant.social_media) {
        try {
          const socialMedia = typeof restaurant.social_media === 'string' 
            ? JSON.parse(restaurant.social_media) 
            : restaurant.social_media;
            
          setInstagram(socialMedia.instagram || "");
          setFacebook(socialMedia.facebook || "");
          setTwitter(socialMedia.twitter || "");
          setWebsite(socialMedia.website || "");
        } catch (e) {
          console.error("Erro ao carregar redes sociais:", e);
        }
      }
    }
  }, [restaurant]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const socialMediaData = {
      instagram,
      facebook,
      twitter,
      website
    };

    const restaurantData = {
      name: restaurantName,
      phone,
      description,
      address,
      logo_url: logo,
      social_media: socialMediaData // Agora enviamos como objeto JSONB
    };

    if (restaurant) {
      // Atualizar restaurante existente
      const updated = await updateRestaurant(restaurantData);
      if (updated) {
        toast({
          title: "Configurações salvas!",
          description: "Suas configurações foram atualizadas com sucesso.",
        });
      }
    } else {
      // Criar novo restaurante
      const created = await createRestaurant(restaurantData);
      if (created) {
        toast({
          title: "Restaurante criado!",
          description: "Seu restaurante foi criado com sucesso.",
        });
      }
    }
  };

  // Manipular upload de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você implementaria o upload real para um serviço de armazenamento
      // Por enquanto, vamos simular criando uma URL local
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para redirecionar para uma aba específica
  const handleTabChange = (tab: string) => {
    if (tab === "profile") {
      navigate("/dashboard/settings/profile");
    } else {
      navigate("/dashboard/settings");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
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
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                    <p className="text-muted-foreground">
                      Configure as preferências do seu restaurante
                    </p>
                  </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {restaurant ? "Salvar Alterações" : "Criar Restaurante"}
                  </Button>
                </div>

                <Tabs defaultValue={getDefaultTab()} className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="mb-6 grid w-full grid-cols-4">
                    <TabsTrigger value="profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Perfil</span>
                    </TabsTrigger>
                    <TabsTrigger value="restaurant-info" className="flex items-center">
                      <StoreIcon className="w-4 h-4 mr-2" />
                      <span>Informações</span>
                    </TabsTrigger>
                    <TabsTrigger value="order-settings" className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Pedidos</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      <span>Notificações</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Aba de Perfil */}
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          Perfil do Restaurante
                        </CardTitle>
                        <CardDescription>
                          Configure a identidade visual e redes sociais do seu restaurante
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <Label htmlFor="logo">Logo do Restaurante</Label>
                          <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                              {logo ? (
                                <img 
                                  src={logo} 
                                  alt="Logo do restaurante" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Image className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <div className="flex flex-col space-y-2 flex-1">
                              <Label htmlFor="logo-upload" className="cursor-pointer">
                                <div className="bg-gradient-brand text-white rounded-md py-2 px-4 inline-flex items-center">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Fazer upload da logo
                                </div>
                                <input
                                  id="logo-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoChange}
                                  className="hidden"
                                />
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                Recomendamos uma imagem quadrada com pelo menos 500x500 pixels
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-2">Redes Sociais</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Adicione os links das suas redes sociais para que os clientes possam te encontrar
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Instagram className="w-5 h-5 text-pink-600" />
                              <Input 
                                placeholder="Link do Instagram" 
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Facebook className="w-5 h-5 text-blue-600" />
                              <Input 
                                placeholder="Link do Facebook" 
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Twitter className="w-5 h-5 text-blue-400" />
                              <Input 
                                placeholder="Link do Twitter" 
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-5 h-5 text-green-600" />
                              <Input 
                                placeholder="Website" 
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Aba de Informações do Restaurante */}
                  <TabsContent value="restaurant-info">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Store className="w-5 h-5 mr-2" />
                          Informações do Restaurante
                        </CardTitle>
                        <CardDescription>
                          Configure as informações básicas do seu restaurante
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome do Restaurante</Label>
                            <Input 
                              id="name" 
                              placeholder="Digite o nome do restaurante"
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input 
                              id="phone" 
                              placeholder="(11) 99999-9999"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Descreva seu restaurante"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input 
                            id="address" 
                            placeholder="Rua, número, bairro"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Aba de Configurações de Pedidos */}
                  <TabsContent value="order-settings">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Configurações de Pedidos
                        </CardTitle>
                        <CardDescription>
                          Configure como os pedidos funcionam no seu restaurante
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="delivery-fee">Taxa de Entrega (R$)</Label>
                            <Input 
                              id="delivery-fee" 
                              type="number" 
                              step="0.01"
                              placeholder="0,00"
                              value={deliveryFee}
                              onChange={(e) => setDeliveryFee(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="min-order">Pedido Mínimo (R$)</Label>
                            <Input 
                              id="min-order" 
                              type="number" 
                              step="0.01"
                              placeholder="0,00"
                              value={minOrder}
                              onChange={(e) => setMinOrder(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="delivery-time">Tempo de Entrega (min)</Label>
                            <Input 
                              id="delivery-time" 
                              type="number" 
                              placeholder="30"
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="delivery-radius">Raio de Entrega (km)</Label>
                            <Input 
                              id="delivery-radius" 
                              type="number" 
                              step="0.1"
                              placeholder="10"
                              value={deliveryRadius}
                              onChange={(e) => setDeliveryRadius(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="space-y-0.5">
                            <Label>Aceitar Pedidos</Label>
                            <p className="text-sm text-muted-foreground">
                              Permitir que clientes façam novos pedidos
                            </p>
                          </div>
                          <Switch 
                            checked={acceptOrders}
                            onCheckedChange={setAcceptOrders}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Aba de Notificações */}
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Bell className="w-5 h-5 mr-2" />
                          Notificações
                        </CardTitle>
                        <CardDescription>
                          Configure suas preferências de notificação
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Novos Pedidos</Label>
                            <p className="text-sm text-muted-foreground">
                              Receber notificações quando novos pedidos chegarem
                            </p>
                          </div>
                          <Switch 
                            checked={newOrderNotifications}
                            onCheckedChange={setNewOrderNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="space-y-0.5">
                            <Label>Avaliações</Label>
                            <p className="text-sm text-muted-foreground">
                              Receber notificações sobre novas avaliações
                            </p>
                          </div>
                          <Switch 
                            checked={reviewNotifications}
                            onCheckedChange={setReviewNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <Label>Canal de Notificações</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Como você gostaria de receber notificações?
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Email</Button>
                            <Button variant="outline" size="sm">SMS</Button>
                            <Button variant="outline" size="sm" className="bg-primary/10">App</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardSettings;
