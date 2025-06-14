import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, CreditCard, MapPin, Clock, Loader2, Search } from 'lucide-react';

// Definir tipos para os dados
interface CustomerWithDetails {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  [key: string]: any;
}

type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "credit_card" | "debit_card" | "pix" | "cash" | "voucher";

// Interface para os dados retornados pela API do ViaCEP
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [notes, setNotes] = useState('');
  const [restaurantData, setRestaurantData] = useState<any>(null);

  // Agrupar itens por restaurante
  const itemsByRestaurant: Record<string, any[]> = items.reduce((acc, item) => {
    if (!acc[item.restaurant_id]) {
      acc[item.restaurant_id] = [];
    }
    acc[item.restaurant_id].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Verificar se o carrinho está vazio ou se o usuário está logado
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
      return;
    }

    if (!user) {
      navigate('/');
      return;
    }

    // Carregar dados do usuário
    const fetchUserData = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          return;
        }

        if (profileData) {
          setCustomerData({
            name: profileData.full_name || '',
            email: user.email || '',
            phone: profileData.phone || ''
          });
        }

        // Buscar dados do cliente para preencher endereço
        const { data, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!customerError && data) {
          // Se tiver endereço salvo, preencher
          if (data.address) {
            setAddress({
              street: data.address || '',
              number: '',
              complement: '',
              neighborhood: '',
              city: data.city || '',
              state: data.state || '',
              zipCode: data.zip_code || ''
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    // Buscar dados do restaurante
    const fetchRestaurantData = async () => {
      if (Object.keys(itemsByRestaurant).length > 0) {
        const restaurantId = Object.keys(itemsByRestaurant)[0];
        
        try {
          const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', restaurantId)
            .single();
            
          if (error) {
            console.error('Erro ao buscar dados do restaurante:', error);
            return;
          }
          
          if (data) {
            setRestaurantData(data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do restaurante:', error);
        }
      }
    };

    fetchUserData();
    fetchRestaurantData();
  }, [user, items, navigate]);

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    // Remover caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return;
    }
    
    setIsCepLoading(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado e tente novamente",
          variant: "destructive",
        });
        return;
      }
      
      setAddress(prev => ({
        ...prev,
        street: data.logradouro || prev.street,
        complement: data.complemento || prev.complement,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
        zipCode: cleanCep
      }));
      
      toast({
        title: "CEP encontrado",
        description: "Endereço preenchido automaticamente",
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível consultar o CEP. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsCepLoading(false);
    }
  };

  // Handler para mudança no campo de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Atualizar o valor do CEP no estado
    setAddress(prev => ({
      ...prev,
      zipCode: value
    }));
    
    // Se o CEP tiver 8 dígitos, buscar automaticamente
    if (value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para finalizar o pedido",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para finalizar o pedido",
        variant: "destructive",
      });
      return;
    }

    // Validar endereço se for entrega
    if (deliveryMethod === 'delivery') {
      if (!address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
        toast({
          title: "Endereço incompleto",
          description: "Preencha todos os campos obrigatórios do endereço",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Obter o restaurante do primeiro item (assumimos que todos os itens são do mesmo restaurante)
      const restaurantId = items[0].restaurant_id;
      
      // Buscar o customer_id usando uma consulta mais simples
      let customerId: string | null = null;
      let customerName: string | null = null;
      let customerPhone: string | null = null;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name, phone')
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId)
          .single();
          
        if (!error && data) {
          customerId = data.id;
          customerName = data.name;
          customerPhone = data.phone;
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
      
      if (!customerId) {
        throw new Error('ID do cliente não encontrado');
      }
      
      // Calcular valores
      const subtotal = getTotal();
      const deliveryFee = deliveryMethod === 'delivery' && restaurantData ? (restaurantData.delivery_fee || 0) : 0;
      const total = subtotal + deliveryFee;
      
      // Gerar número do pedido
      const orderNumber = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
      
      // Criar pedido
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          restaurant_id: restaurantId,
          order_number: orderNumber,
          status: 'pending',
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total: total,
          payment_method: paymentMethod,
          payment_status: 'pending',
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? `${address.street}, ${address.number}` : null,
          delivery_city: deliveryMethod === 'delivery' ? address.city : null,
          delivery_state: deliveryMethod === 'delivery' ? address.state : null,
          delivery_zip_code: deliveryMethod === 'delivery' ? address.zipCode : null,
          customer_name: customerName || customerData.name,
          customer_phone: customerPhone || customerData.phone,
          customer_email: user.email || '',
          notes: notes,
        })
        .select('id')
        .single();
        
      if (orderError) {
        console.error('Erro ao criar pedido:', orderError);
        throw new Error('Não foi possível criar o pedido');
      }
      
      const orderId = newOrder.id;
      
      // Adicionar itens ao pedido
      for (const item of items) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
            notes: ''
          });
          
        if (itemError) {
          console.error('Erro ao adicionar item ao pedido:', itemError);
          // Continuar mesmo com erro para tentar adicionar os outros itens
        }
      }
      
      // Limpar o carrinho após finalizar o pedido
      clearCart();
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${orderNumber} foi enviado ao restaurante.`,
      });
      
      // Redirecionar para página de confirmação
      navigate('/pedido-confirmado');
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: "Erro ao finalizar pedido",
        description: error.message || "Ocorreu um erro ao processar seu pedido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Método de entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Método de entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="font-medium">Entrega</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="font-medium">Retirada no local</Label>
                    </div>
                  </RadioGroup>

                  {deliveryMethod === 'delivery' && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                      <h4 className="font-medium">Endereço de entrega</h4>
                      
                      {/* Campo de CEP com botão de busca */}
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="zipCode" 
                            value={address.zipCode}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            required={deliveryMethod === 'delivery'}
                            className="flex-1"
                            maxLength={9}
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={() => fetchAddressByCep(address.zipCode)}
                            disabled={isCepLoading || address.zipCode.replace(/\D/g, '').length !== 8}
                          >
                            {isCepLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Search className="h-4 w-4 mr-1" />
                            )}
                            Buscar
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Digite o CEP para preencher o endereço automaticamente
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">Rua</Label>
                          <Input 
                            id="street" 
                            value={address.street}
                            onChange={(e) => setAddress({...address, street: e.target.value})}
                            required={deliveryMethod === 'delivery'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input 
                            id="number" 
                            value={address.number}
                            onChange={(e) => setAddress({...address, number: e.target.value})}
                            required={deliveryMethod === 'delivery'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input 
                          id="complement" 
                          value={address.complement}
                          onChange={(e) => setAddress({...address, complement: e.target.value})}
                          placeholder="Apartamento, bloco, referência (opcional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input 
                            id="neighborhood" 
                            value={address.neighborhood}
                            onChange={(e) => setAddress({...address, neighborhood: e.target.value})}
                            required={deliveryMethod === 'delivery'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input 
                            id="city" 
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                            required={deliveryMethod === 'delivery'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select 
                          value={address.state} 
                          onValueChange={(value) => setAddress({...address, state: value})}
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Método de pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Método de pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="font-medium">PIX</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="font-medium">Cartão de crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit_card" id="debit_card" />
                      <Label htmlFor="debit_card" className="font-medium">Cartão de débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="font-medium">Dinheiro</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Alguma observação para o restaurante?</Label>
                    <Textarea 
                      id="notes" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Sem cebola, troco para R$ 50,00, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:hidden">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Finalizar pedido"}
                </Button>
              </div>
            </form>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Itens do carrinho */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Totais */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(getTotal())}</span>
                    </div>
                    
                    {deliveryMethod === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Taxa de entrega</span>
                        <span>
                          {restaurantData ? formatCurrency(restaurantData.delivery_fee || 0) : 'Calculando...'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total</span>
                      <span>
                        {formatCurrency(getTotal() + (
                          deliveryMethod === 'delivery' && restaurantData 
                            ? (restaurantData.delivery_fee || 0) 
                            : 0
                        ))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block pt-4">
                    <Button 
                      type="submit"
                      onClick={handleSubmitOrder}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : "Finalizar pedido"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 