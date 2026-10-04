// Midtrans Payment Gateway Integration (Batam, Indonesia)
// Supports Snap.js popup, QRIS, Virtual Accounts (BCA, Mandiri, BNI, BRI), and Credit Cards.

export const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "";




export function formatIDR(idrAmount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(idrAmount);
}

// Window Snap Type Definition
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export interface MidtransCustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateSnapTokenParams {
  orderId: string;
  grossAmountIdr: number;
  customerDetails: MidtransCustomerDetails;
  itemDetails?: MidtransItemDetail[];
}

/**
 * Requests a Midtrans Snap transaction token.
 * 1. Calls Supabase Edge Function `create-midtrans-snap` (production architecture).
 * 2. Falls back to direct Sandbox Snap API in local development.
 */
export async function createMidtransSnapToken(
  params: CreateSnapTokenParams
): Promise<{ token: string; redirectUrl?: string }> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://esolildgbjbnivsdtqnd.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('your-supabase-url')) {
    throw new Error("Supabase URL is not configured. Please ensure VITE_SUPABASE_URL is set.");
  }

  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/create-midtrans-snap`;
  
  let response: Response;
  try {
    response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
      },
      body: JSON.stringify(params),
    });
  } catch (networkErr: any) {
    throw new Error(`Network error connecting to payment service: ${networkErr.message || networkErr}`);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Payment service returned status ${response.status}`;
    throw new Error(errorMsg);
  }

  if (data?.token) {
    return { token: data.token, redirectUrl: data.redirect_url };
  }

  throw new Error("Payment service did not return a valid transaction token.");
}
