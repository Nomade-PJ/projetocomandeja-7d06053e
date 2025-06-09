import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { realtimeService } from '@/integrations/supabase/realtimeService';
import { useRestaurant } from '@/hooks/useRestaurant';
import { formatCurrency } from '@/lib/utils';

export interface DashboardStats {
  todaySales: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  todayOrders: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  newCustomers: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  averageTime: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  monthlySales: {
    data: {
      name: string;
      vendas: number;
    }[];
  };
  topProducts: {
    id: string;
    name: string;
    quantity: number;
    total: number;
    image_url?: string;
  }[];
  recentOrders: {
    id: string;
    order_number: string;
    customer_name: string;
    created_at: string;
    status: string;
    total: number;
  }[];
}

export function useDashboardStats() {
  const { restaurant } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: { value: formatCurrency(0), change: '0%', changeType: 'neutral' },
    todayOrders: { value: '0', change: '0%', changeType: 'neutral' },
    newCustomers: { value: '0', change: '0%', changeType: 'neutral' },
    averageTime: { value: '0 min', change: '0%', changeType: 'neutral' },
    monthlySales: {
      data: Array.from({ length: 12 }, (_, i) => ({
        name: String(i + 1).padStart(2, '0'),
        vendas: 0,
      })),
    },
    topProducts: [],
    recentOrders: [],
  });

  // Definir fetchDashboardStats fora do useEffect para poder usar em diferentes effects
  const fetchDashboardStats = async () => {
    if (!restaurant) return;
    
    try {
      setLoading(true);
      
      // Obter a data de hoje e ontem
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // 1. Obter vendas de hoje e de ontem
      const { data: salesData, error: salesError } = await supabase
        .from('dashboard_statistics')
        .select('date, total_revenue')
        .eq('restaurant_id', restaurant.id)
        .in('date', [todayStr, yesterdayStr]);
      
      if (salesError) throw salesError;
      
      const todaySalesData = salesData?.find(item => item.date === todayStr);
      const yesterdaySalesData = salesData?.find(item => item.date === yesterdayStr);
      
      const todaySales = todaySalesData?.total_revenue || 0;
      const yesterdaySales = yesterdaySalesData?.total_revenue || 0;
      
      // Calcular a mudança percentual nas vendas
      const salesChange = yesterdaySales > 0 
        ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 
        : 0;
      
      const salesChangeType = 
        salesChange > 0 ? 'positive' : 
        salesChange < 0 ? 'negative' : 
        'neutral';
      
      // 2. Obter pedidos de hoje e ontem
      const { data: ordersData, error: ordersError } = await supabase
        .from('dashboard_statistics')
        .select('date, total_orders')
        .eq('restaurant_id', restaurant.id)
        .in('date', [todayStr, yesterdayStr]);
      
      if (ordersError) throw ordersError;
      
      const todayOrdersData = ordersData?.find(item => item.date === todayStr);
      const yesterdayOrdersData = ordersData?.find(item => item.date === yesterdayStr);
      
      const todayOrders = todayOrdersData?.total_orders || 0;
      const yesterdayOrders = yesterdayOrdersData?.total_orders || 0;
      
      // Calcular a mudança percentual nos pedidos
      const ordersChange = yesterdayOrders > 0 
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
        : 0;
      
      const ordersChangeType = 
        ordersChange > 0 ? 'positive' : 
        ordersChange < 0 ? 'negative' : 
        'neutral';
      
      // 3. Obter novos clientes de hoje e ontem
      const { data: customersData, error: customersError } = await supabase
        .from('dashboard_statistics')
        .select('date, total_customers')
        .eq('restaurant_id', restaurant.id)
        .in('date', [todayStr, yesterdayStr]);
      
      if (customersError) throw customersError;
      
      const todayCustomersData = customersData?.find(item => item.date === todayStr);
      const yesterdayCustomersData = customersData?.find(item => item.date === yesterdayStr);
      
      const todayCustomers = todayCustomersData?.total_customers || 0;
      const yesterdayCustomers = yesterdayCustomersData?.total_customers || 0;
      
      // Calcular a mudança percentual nos clientes
      const customersChange = yesterdayCustomers > 0 
        ? ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100 
        : 0;
      
      const customersChangeType = 
        customersChange > 0 ? 'positive' : 
        customersChange < 0 ? 'negative' : 
        'neutral';
      
      // 4. Calcular tempo médio dos pedidos
      const { data: ordersTimeData, error: ordersTimeError } = await supabase
        .from('orders')
        .select('created_at, updated_at, status')
        .eq('restaurant_id', restaurant.id)
        .eq('status', 'delivered')
        .gte('created_at', today.toISOString().split('T')[0]);
      
      let averageTime = 0;
      let averageTimeChange = 0;
      let averageTimeChangeType: 'positive' | 'negative' | 'neutral' = 'neutral';
      
      if (!ordersTimeError && ordersTimeData && ordersTimeData.length > 0) {
        // Calcular tempo médio de entrega de hoje
        const totalMinutes = ordersTimeData.reduce((acc, order) => {
          const createdAt = new Date(order.created_at);
          const updatedAt = new Date(order.updated_at);
          const diffMinutes = (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60);
          return acc + diffMinutes;
        }, 0);
        
        averageTime = Math.round(totalMinutes / ordersTimeData.length);
        
        // Obter tempo médio de ontem para comparação
        const { data: yesterdayTimeData } = await supabase
          .from('orders')
          .select('created_at, updated_at, status')
          .eq('restaurant_id', restaurant.id)
          .eq('status', 'delivered')
          .gte('created_at', yesterdayStr)
          .lt('created_at', todayStr);
        
        if (yesterdayTimeData && yesterdayTimeData.length > 0) {
          const yesterdayTotalMinutes = yesterdayTimeData.reduce((acc, order) => {
            const createdAt = new Date(order.created_at);
            const updatedAt = new Date(order.updated_at);
            const diffMinutes = (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60);
            return acc + diffMinutes;
          }, 0);
          
          const yesterdayAverageTime = Math.round(yesterdayTotalMinutes / yesterdayTimeData.length);
          
          // Calcular mudança percentual no tempo médio
          averageTimeChange = yesterdayAverageTime > 0 
            ? ((averageTime - yesterdayAverageTime) / yesterdayAverageTime) * 100 
            : 0;
          
          // Para tempo, menor é melhor, então invertemos a lógica
          averageTimeChangeType = 
            averageTimeChange < 0 ? 'positive' : 
            averageTimeChange > 0 ? 'negative' : 
            'neutral';
        }
      }
      
      // 5. Obter vendas mensais
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: monthlySalesData, error: monthlySalesError } = await supabase
        .from('dashboard_statistics')
        .select('date, total_revenue')
        .eq('restaurant_id', restaurant.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      let monthlySales = Array.from({ length: 12 }, (_, i) => ({
        name: String(i + 1).padStart(2, '0'),
        vendas: 0,
      }));
      
      if (!monthlySalesError && monthlySalesData) {
        // Processar os dados dos últimos 12 dias
        const last12Days = monthlySalesData.slice(-12);
        
        monthlySales = last12Days.map((item, index) => {
          const day = new Date(item.date).getDate().toString().padStart(2, '0');
          return {
            name: day,
            vendas: Number(item.total_revenue || 0),
          };
        });
        
        // Se temos menos de 12 dias de dados, preencher com zeros
        if (monthlySales.length < 12) {
          const daysToAdd = 12 - monthlySales.length;
          const lastDate = monthlySales.length > 0 
            ? new Date(monthlySalesData[monthlySalesData.length - 1].date) 
            : new Date();
          
          for (let i = 1; i <= daysToAdd; i++) {
            const nextDay = new Date(lastDate);
            nextDay.setDate(nextDay.getDate() + i);
            monthlySales.push({
              name: nextDay.getDate().toString().padStart(2, '0'),
              vendas: 0,
            });
          }
        }
      }
      
      // 6. Obter produtos mais vendidos
      const topProductsResponse = await (supabase as any)
        .rpc('get_top_products', { 
          restaurant_id_param: restaurant.id,
          limit_param: 5
        });
      
      const topProductsData = topProductsResponse.data;
      const topProductsError = topProductsResponse.error;
      
      const topProducts = !topProductsError && topProductsData 
        ? topProductsData.map((product: any) => ({
            id: product.id,
            name: product.name,
            quantity: Number(product.total_quantity) || 0,
            total: Number(product.total_revenue) || 0,
            image_url: product.image_url,
          }))
        : [];
      
      // 7. Obter pedidos recentes
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, created_at, status, total')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const recentOrders = !recentOrdersError && recentOrdersData 
        ? recentOrdersData.map(order => ({
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            created_at: order.created_at,
            status: order.status,
            total: order.total,
          }))
        : [];
      
      // Atualizar o estado com todos os dados
      setStats({
        todaySales: {
          value: formatCurrency(todaySales),
          change: `${salesChange.toFixed(0)}%`,
          changeType: salesChangeType,
        },
        todayOrders: {
          value: todayOrders.toString(),
          change: `${ordersChange.toFixed(0)}%`,
          changeType: ordersChangeType,
        },
        newCustomers: {
          value: todayCustomers.toString(),
          change: `${customersChange.toFixed(0)}%`,
          changeType: customersChangeType,
        },
        averageTime: {
          value: `${averageTime} min`,
          change: `${averageTimeChange.toFixed(0)}%`,
          changeType: averageTimeChangeType,
        },
        monthlySales: {
          data: monthlySales,
        },
        topProducts,
        recentOrders,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect para buscar dados iniciais
  useEffect(() => {
    if (restaurant) {
      fetchDashboardStats();
    }
  }, [restaurant]);

  // Effect separado para o intervalo de atualização
  useEffect(() => {
    if (!restaurant) return;
    
    // Configurar intervalo para atualizar os dados a cada 5 minutos
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [restaurant]);

  // Effect separado para inscrições em tempo real
  useEffect(() => {
    if (!restaurant) return;
    
    // Usar o serviço centralizado de Realtime
    const unsubscribeOrders = realtimeService.subscribeToTable('orders', restaurant.id, fetchDashboardStats);
    const unsubscribeStats = realtimeService.subscribeToTable('dashboard_statistics', restaurant.id, fetchDashboardStats);
    
    // Limpar inscrições quando o componente for desmontado
    return () => {
      unsubscribeOrders();
      unsubscribeStats();
    };
  }, [restaurant]);
  
  return { stats, loading };
} 