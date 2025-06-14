import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirecionar para a página inicial após 5 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <CardTitle className="text-2xl">Pedido confirmado!</CardTitle>
          <CardDescription>
            Seu pedido foi recebido e está sendo processado pelo restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Você receberá atualizações sobre o status do seu pedido por e-mail.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link to="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Button>
            </Link>
            
            <p className="text-center text-sm text-gray-500">
              Redirecionando em {countdown} segundos...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation; 