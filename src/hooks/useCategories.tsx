
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
    } else {
      setLoading(false);
    }
  }, [restaurant?.id]);

  const fetchCategories = async () => {
    if (!restaurant?.id) {
      setLoading(false);
      return;
    }

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
    if (!restaurant?.id) {
      toast({
        title: "Erro",
        description: "Restaurante não encontrado",
        variant: "destructive"
      });
      return null;
    }

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

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar categoria",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!"
      });

      fetchCategories();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar categoria",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Categoria deletada com sucesso!"
      });

      fetchCategories();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { 
    categories, 
    loading, 
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories 
  };
};
