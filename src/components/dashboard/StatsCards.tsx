
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Users, Clock } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Vendas Hoje",
      value: "R$ 0,00",
      change: "+0%",
      changeType: "neutral" as const,
      icon: TrendingUp,
    },
    {
      title: "Pedidos Hoje",
      value: "0",
      change: "+0%",
      changeType: "neutral" as const,
      icon: ShoppingBag,
    },
    {
      title: "Novos Clientes",
      value: "0",
      change: "+0%",
      changeType: "neutral" as const,
      icon: Users,
    },
    {
      title: "Tempo Médio",
      value: "0 min",
      change: "+0%",
      changeType: "neutral" as const,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="stat-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs flex items-center mt-1 ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'negative' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              <span>{stat.change} vs. ontem</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
