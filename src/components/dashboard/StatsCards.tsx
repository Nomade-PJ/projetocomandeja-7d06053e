
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Vendas Hoje",
      value: "R$ 2.847,50",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs. ontem"
    },
    {
      title: "Pedidos Hoje",
      value: "47",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      description: "vs. ontem"
    },
    {
      title: "Novos Clientes",
      value: "12",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      description: "esta semana"
    },
    {
      title: "Tempo Médio",
      value: "28 min",
      change: "-5.3%",
      trend: "up",
      icon: Clock,
      description: "de entrega"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === "up";
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="stat-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-brand-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center text-xs">
                <Badge 
                  variant="secondary" 
                  className={`mr-1 ${
                    isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
