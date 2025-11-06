// Helper functions to work around Supabase type issues
import { supabase } from "@/integrations/supabase/client";

export const queryProductLikes = {
  select: (columns: string) => {
    return (supabase as any).from("product_likes").select(columns);
  },
  insert: (data: any[]) => {
    return (supabase as any).from("product_likes").insert(data);
  },
};

export const queryAdminTwoFactor = {
  select: (columns: string) => {
    return (supabase as any).from("admin_twofactor").select(columns);
  },
  insert: (data: any) => {
    return (supabase as any).from("admin_twofactor").insert(data);
  },
};

export const queryProducts = {
  select: (columns: string) => {
    return (supabase as any).from("products").select(columns);
  },
};

export const callRpc = (functionName: string, params: any) => {
  return (supabase as any).rpc(functionName, params);
};
