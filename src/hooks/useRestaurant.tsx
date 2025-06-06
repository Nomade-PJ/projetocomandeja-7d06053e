
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  logo_url?: string;
  banner_url?: string;
  is_active: boolean;
  owner_id?: string;
}

export const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do restaurante",
          variant: "destructive"
        });
      } else {
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRestaurant = async (restaurantData: Omit<Restaurant, 'id' | 'slug' | 'owner_id' | 'is_active'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar um restaurante",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          ...restaurantData,
          owner_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating restaurant:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar restaurante",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Restaurante criado com sucesso!"
      });

      setRestaurant(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) return null;

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(updates)
        .eq('id', restaurant.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating restaurant:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar restaurante",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Restaurante atualizado com sucesso!"
      });

      setRestaurant(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return { 
    restaurant, 
    loading, 
    refetch: fetchRestaurant, 
    createRestaurant,
    updateRestaurant 
  };
};
