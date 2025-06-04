
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthContext {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

export const signUp = async (email: string, password: string, fullName: string, role: string = 'restaurant_owner') => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        role: role
      }
    }
  });
  
  return { error };
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
