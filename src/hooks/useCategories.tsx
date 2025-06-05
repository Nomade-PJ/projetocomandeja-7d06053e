
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRestaurant } from './useRestaurant';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { restaurant } = useRestaurant();
  const { toast } = useToast();

  useEffect(() => {
    if (restaurant?.id) {
      fetchCategories();
    }
  }, [restaurant?.id]);

  const fetchCategories = async () => {
    if (!restaurant?.id) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('display_order');

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar categorias",
          variant: "destructive"
        });
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'restaurant_id'>) => {
    if (!restaurant?.id) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...categoryData,
          restaurant_id: restaurant.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar categoria",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso!"
      });

      fetchCategories();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return { categories, loading, createCategory, refetch: fetchCategories };
};
