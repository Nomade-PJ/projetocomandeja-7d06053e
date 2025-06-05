
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Store, Bell, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
  const { toast } = useToast();
  
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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement settings save logic
    console.log("Saving settings:", {
      restaurantName,
      phone,
      description,
      address,
      deliveryFee: parseFloat(deliveryFee) || 0,
      minOrder: parseFloat(minOrder) || 0,
      deliveryTime: parseInt(deliveryTime) || 30,
      deliveryRadius: parseFloat(deliveryRadius) || 10,
      newOrderNotifications,
      reviewNotifications,
      acceptOrders,
    });

    toast({
      title: "Configurações salvas!",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

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
                    Salvar Alterações
                  </Button>
                </div>

                <div className="grid gap-6">
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Configurações de Pedidos
                      </CardTitle>
                      <CardDescription>
                        Configure como os pedidos funcionam
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                  </Card>

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
                    <CardContent className="space-y-4">
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
                      <div className="flex items-center justify-between">
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
                      <div className="flex items-center justify-between">
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
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardSettings;
