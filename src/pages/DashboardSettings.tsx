
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

const DashboardSettings = () => {
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
                  <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                  <p className="text-muted-foreground">
                    Configure as preferências do seu restaurante
                  </p>
                </div>
                <Button className="bg-gradient-brand hover:from-brand-700 hover:to-brand-600 text-white">
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
                        <Input id="name" placeholder="Digite o nome do restaurante" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="(11) 99999-9999" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva seu restaurante" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" placeholder="Rua, número, bairro" />
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
                        <Input id="delivery-fee" type="number" placeholder="0,00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-order">Pedido Mínimo (R$)</Label>
                        <Input id="min-order" type="number" placeholder="0,00" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="delivery-time">Tempo de Entrega (min)</Label>
                        <Input id="delivery-time" type="number" placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-radius">Raio de Entrega (km)</Label>
                        <Input id="delivery-radius" type="number" placeholder="10" />
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
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Avaliações</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações sobre novas avaliações
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Aceitar Pedidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que clientes façam novos pedidos
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardSettings;
