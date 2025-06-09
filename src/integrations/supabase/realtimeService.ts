import { supabase } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Singleton para gerenciar canais Realtime do Supabase
class RealtimeService {
  private channels: Map<string, RealtimeChannel>;
  private listeners: Map<string, Set<() => void>>;

  constructor() {
    this.channels = new Map();
    this.listeners = new Map();
  }

  /**
   * Subscreve a mudanças em uma tabela para um restaurante específico
   * @param table Nome da tabela
   * @param restaurantId ID do restaurante
   * @param callback Função a ser executada quando houver mudanças
   * @returns Uma função para cancelar a subscrição
   */
  subscribeToTable(table: string, restaurantId: string, callback: () => void): () => void {
    const channelId = `${table}_changes_${restaurantId}`;
    
    // Adicionar callback à lista de listeners
    if (!this.listeners.has(channelId)) {
      this.listeners.set(channelId, new Set());
    }
    
    this.listeners.get(channelId)?.add(callback);
    
    // Se o canal já existe, não criar novamente
    if (!this.channels.has(channelId)) {
      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `restaurant_id=eq.${restaurantId}`,
          },
          () => {
            // Notificar todos os listeners
            this.listeners.get(channelId)?.forEach(listener => listener());
          }
        )
        .subscribe((status) => {
          console.log(`Subscription to ${table} for restaurant ${restaurantId}: ${status}`);
        });
      
      this.channels.set(channelId, channel);
    }
    
    // Retornar função para cancelar a subscrição
    return () => {
      const listeners = this.listeners.get(channelId);
      
      if (listeners) {
        listeners.delete(callback);
        
        // Se não houver mais listeners, remover o canal
        if (listeners.size === 0) {
          const channel = this.channels.get(channelId);
          if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(channelId);
            this.listeners.delete(channelId);
          }
        }
      }
    };
  }

  /**
   * Cancela todas as subscrições
   */
  unsubscribeAll() {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    
    this.channels.clear();
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService(); 