
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesChart = () => {
  const data = [
    { name: "01", vendas: 0 },
    { name: "02", vendas: 0 },
    { name: "03", vendas: 0 },
    { name: "04", vendas: 0 },
    { name: "05", vendas: 0 },
    { name: "06", vendas: 0 },
    { name: "07", vendas: 0 },
    { name: "08", vendas: 0 },
    { name: "09", vendas: 0 },
    { name: "10", vendas: 0 },
    { name: "11", vendas: 0 },
    { name: "12", vendas: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas do Mês</CardTitle>
        <CardDescription>
          Evolução das vendas nos últimos 12 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
              cursor={{fill: 'rgba(0, 0, 0, 0.1)'}}
              formatter={(value: any) => [`R$ ${value}`, 'Vendas']}
            />
            <Bar 
              dataKey="vendas" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
