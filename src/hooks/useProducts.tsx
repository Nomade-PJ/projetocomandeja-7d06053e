
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRestaurant } from './useRestaurant';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  preparation_time: number;
  display_order: number;
  category_id?: string;
  restaurant_id: string;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { restaurant } = useRestaurant();
  const { toast } = useToast();

  useEffect(() => {
    if (restaurant?.id) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [restaurant?.id]);

  const fetchProducts = async () => {
    if (!restaurant?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('display_order');

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar produtos",
          variant: "destructive"
        });
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'restaurant_id'>) => {
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
        .from('products')
        .insert({
          ...productData,
          restaurant_id: restaurant.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar produto",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!"
      });

      fetchProducts();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar produto",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!"
      });

      fetchProducts();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar produto",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Produto deletado com sucesso!"
      });

      fetchProducts();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return { 
    products, 
    loading, 
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts 
  };
};
