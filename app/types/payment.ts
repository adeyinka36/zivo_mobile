export interface PaymentIntent {
  client_secret: string;
  payment_id: string;
  existing?: boolean;
}

export interface PaymentStatus {
  payment_id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  amount: number;
  currency: string;
  paid_at?: string;
  failure_reason?: string;
}

export interface PaymentHistory {
  payments: Array<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
    paid_at?: string;
    media: {
      id: string;
      name: string;
      file_name: string;
    };
  }>;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RefundRequest {
  reason: string;
  amount?: number;
}

export interface RefundResponse {
  message: string;
  refund_id: string;
  amount: number;
  status: string;
}

export type PaymentMethod = 'Card' | 'ApplePay' | 'GooglePay'; 