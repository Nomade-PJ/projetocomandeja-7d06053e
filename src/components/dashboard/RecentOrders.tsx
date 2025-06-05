
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Pedidos Recentes
        </CardTitle>
        <CardDescription>
          Últimos pedidos realizados no seu restaurante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
          <p className="text-gray-400 text-sm mt-2">Os pedidos aparecerão aqui quando forem realizados</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
