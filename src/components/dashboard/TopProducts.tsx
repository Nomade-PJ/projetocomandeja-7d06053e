
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const TopProducts = () => {
  const topProducts = [
    {
      name: "X-Bacon Especial",
      sales: 24,
      revenue: "R$ 480,00",
      growth: "+15%"
    },
    {
      name: "Pizza Margherita",
      sales: 18,
      revenue: "R$ 540,00",
      growth: "+8%"
    },
    {
      name: "Hambúrguer Artesanal",
      sales: 16,
      revenue: "R$ 320,00",
      growth: "+12%"
    },
    {
      name: "Batata Frita Grande",
      sales: 32,
      revenue: "R$ 256,00",
      growth: "+20%"
    },
    {
      name: "Refrigerante Lata",
      sales: 28,
      revenue: "R$ 140,00",
      growth: "+5%"
    }
  ];

  return (
    <Card className="stat-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-600" />
          Produtos em Alta
        </CardTitle>
        <CardDescription>
          Mais vendidos hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {product.sales} vendas
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{product.revenue}</div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  {product.growth}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
