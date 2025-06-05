
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package } from "lucide-react";

const TopProducts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Produtos em Alta
        </CardTitle>
        <CardDescription>
          Produtos mais vendidos hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum produto vendido</p>
          <p className="text-gray-400 text-sm mt-2">Os produtos mais vendidos aparecerão aqui</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
