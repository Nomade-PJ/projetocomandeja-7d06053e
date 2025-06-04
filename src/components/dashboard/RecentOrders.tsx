
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone } from "lucide-react";

const RecentOrders = () => {
  const orders = [
    {
      id: "#001234",
      customer: "João Silva",
      items: "2x X-Bacon, 1x Batata Frita",
      total: "R$ 45,90",
      status: "preparing",
      time: "15 min",
      address: "Rua das Flores, 123",
      phone: "(11) 99999-9999"
    },
    {
      id: "#001235",
      customer: "Maria Santos",
      items: "1x Pizza Margherita, 1x Refrigerante",
      total: "R$ 35,00",
      status: "ready",
      time: "5 min",
      address: "Av. Principal, 456",
      phone: "(11) 88888-8888"
    },
    {
      id: "#001236",
      customer: "Pedro Costa",
      items: "1x Hambúrguer Artesanal, 1x Suco",
      total: "R$ 28,50",
      status: "delivered",
      time: "Entregue",
      address: "Rua da Paz, 789",
      phone: "(11) 77777-7777"
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      preparing: { label: "Preparando", color: "bg-yellow-100 text-yellow-700" },
      ready: { label: "Pronto", color: "bg-blue-100 text-blue-700" },
      delivered: { label: "Entregue", color: "bg-green-100 text-green-700" }
    };
    return configs[status as keyof typeof configs] || configs.preparing;
  };

  return (
    <Card className="stat-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>
              Últimos pedidos recebidos
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{order.id}</span>
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-1">
                    <strong>{order.customer}</strong>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {order.items}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.phone}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg mb-1">{order.total}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {order.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
