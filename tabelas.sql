
-- ========================================
-- SISTEMA COMANDEJÁ - ESTRUTURA DO BANCO
-- ========================================
-- Este arquivo contém todas as tabelas do sistema ComandeJá
-- Para uso em projetos futuros e referência

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed', 
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card',
  'debit_card',
  'pix',
  'cash',
  'voucher'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE delivery_method AS ENUM (
  'delivery',
  'pickup'
);

CREATE TYPE user_role AS ENUM (
  'admin',
  'restaurant_owner',
  'customer'
);

-- ========================================
-- TABELA DE PERFIS DE USUÁRIOS
-- ========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABELA DE RESTAURANTES
-- ========================================
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  logo_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  opening_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONFIGURAÇÕES DO RESTAURANTE
-- ========================================
CREATE TABLE public.restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  minimum_order_value DECIMAL DEFAULT 0,
  delivery_fee DECIMAL DEFAULT 0,
  delivery_radius DECIMAL DEFAULT 10,
  estimated_delivery_time INTEGER DEFAULT 30,
  accepts_orders BOOLEAN DEFAULT true,
  accepted_payment_methods TEXT[] DEFAULT ARRAY['credit_card', 'debit_card', 'pix', 'cash'],
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id)
);

-- ========================================
-- CATEGORIAS DE PRODUTOS
-- ========================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PRODUTOS
-- ========================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  preparation_time INTEGER DEFAULT 15,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CLIENTES
-- ========================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  last_order_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CUPONS DE DESCONTO
-- ========================================
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL NOT NULL CHECK (discount_value > 0),
  minimum_order_value DECIMAL DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, code)
);

-- ========================================
-- PEDIDOS
-- ========================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL DEFAULT 0,
  discount_amount DECIMAL DEFAULT 0,
  total DECIMAL NOT NULL CHECK (total >= 0),
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  delivery_method delivery_method NOT NULL,
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_state TEXT,
  delivery_zip_code TEXT,
  delivery_latitude DECIMAL,
  delivery_longitude DECIMAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  notes TEXT,
  coupon_code TEXT,
  estimated_delivery_time INTEGER,
  scheduled_delivery_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ITENS DOS PEDIDOS
-- ========================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_price DECIMAL NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AVALIAÇÕES
-- ========================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ESTATÍSTICAS DO DASHBOARD
-- ========================================
CREATE TABLE public.dashboard_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  average_order_value DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, date)
);

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_statistics ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Políticas para restaurants
CREATE POLICY "Restaurant owners can manage their restaurants" ON public.restaurants
  FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Public can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);

-- Políticas para restaurant_settings
CREATE POLICY "Restaurant owners can manage their settings" ON public.restaurant_settings
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));

-- Políticas para categories
CREATE POLICY "Restaurant owners can manage their categories" ON public.categories
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Políticas para products
CREATE POLICY "Restaurant owners can manage their products" ON public.products
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Políticas para customers
CREATE POLICY "Restaurant owners can manage their customers" ON public.customers
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));

-- Políticas para coupons
CREATE POLICY "Restaurant owners can manage their coupons" ON public.coupons
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));

-- Políticas para orders
CREATE POLICY "Restaurant owners can manage their orders" ON public.orders
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));
CREATE POLICY "Public can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Políticas para order_items
CREATE POLICY "Restaurant owners can view their order items" ON public.order_items
  FOR SELECT USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.restaurants r ON o.restaurant_id = r.id
    WHERE r.owner_id = auth.uid()
  ));
CREATE POLICY "Public can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Políticas para reviews
CREATE POLICY "Restaurant owners can manage reviews for their restaurants" ON public.reviews
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));
CREATE POLICY "Public can view reviews" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Public can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Políticas para dashboard_statistics
CREATE POLICY "Restaurant owners can manage their statistics" ON public.dashboard_statistics
  FOR ALL USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
  ));

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX idx_categories_restaurant_id ON public.categories(restaurant_id);
CREATE INDEX idx_products_restaurant_id ON public.products(restaurant_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_customers_restaurant_id ON public.customers(restaurant_id);
CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_reviews_restaurant_id ON public.reviews(restaurant_id);
CREATE INDEX idx_dashboard_statistics_restaurant_date ON public.dashboard_statistics(restaurant_id, date);

-- ========================================
-- FUNÇÕES E TRIGGERS
-- ========================================

-- Função para registrar novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT DO UPDATE para lidar com possíveis conflitos de email
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(
      (CASE 
        WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL AND NEW.raw_user_meta_data->>'role' != '' 
        THEN NEW.raw_user_meta_data->>'role'
        ELSE 'customer'
      END)::user_role,
      'customer'::user_role
    )
  )
  ON CONFLICT (email) DO UPDATE SET
    id = NEW.id,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
    role = COALESCE(
      (CASE 
        WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL AND NEW.raw_user_meta_data->>'role' != '' 
        THEN NEW.raw_user_meta_data->>'role'
        ELSE profiles.role::text
      END)::user_role,
      profiles.role
    ),
    updated_at = now();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log o erro mas não falhe a transação
    RAISE WARNING 'Erro em handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurant_settings_updated_at BEFORE UPDATE ON public.restaurant_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dashboard_statistics_updated_at BEFORE UPDATE ON public.dashboard_statistics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar números de pedido
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Sequência para números de pedido
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Função para atualizar estatísticas do cliente
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.customers
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total,
      last_order_at = NEW.created_at
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estatísticas do cliente
CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats();
