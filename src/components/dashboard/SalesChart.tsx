
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const SalesChart = () => {
  const data = [
    { name: "01", vendas: 1200 },
    { name: "02", vendas: 1900 },
    { name: "03", vendas: 800 },
    { name: "04", vendas: 1600 },
    { name: "05", vendas: 2100 },
    { name: "06", vendas: 1800 },
    { name: "07", vendas: 2400 },
    { name: "08", vendas: 2200 },
    { name: "09", vendas: 2800 },
    { name: "10", vendas: 2600 },
    { name: "11", vendas: 3100 },
    { name: "12", vendas: 2900 },
  ];

  return (
    <Card className="stat-card">
      <CardHeader>
        <CardTitle>Vendas do Mês</CardTitle>
        <CardDescription>
          Evolução das vendas nos últimos 12 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
              formatter={(value) => [`R$ ${value}`, "Vendas"]}
              labelFormatter={(label) => `Dia ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
