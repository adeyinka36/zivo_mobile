import { api } from '../context/auth';
import { 
  PaymentIntent, 
  PaymentStatus, 
  PaymentHistory, 
  RefundRequest, 
  RefundResponse 
} from 'types/payment';

 class PaymentService {
  /**
   * Create payment intent for media upload
   */
  static async createPaymentIntent(mediaId: string): Promise<PaymentIntent> {
    try {
      const response = await api.post(`/media/${mediaId}/payment-intent`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to get payment status:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(page: number = 1): Promise<PaymentHistory> {
    try {
      const response = await api.get(`/payments/history?page=${page}`);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to get payment history:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment history');
    }
  }

  /**
   * Request refund
   */
  static async requestRefund(paymentId: string, refundData: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, refundData);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Failed to request refund:', error);
      throw new Error(error.response?.data?.message || 'Failed to request refund');
    }
  }

  /**
   * Poll payment status until completion
   */
  static async pollPaymentStatus(paymentId: string, maxAttempts: number = 30): Promise<PaymentStatus> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const poll = async () => {
        try {
          const status = await this.getPaymentStatus(paymentId);
          
          if (status.status === 'succeeded' || status.status === 'failed' || status.status === 'canceled') {
            resolve(status);
            return;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Payment status polling timeout'));
            return;
          }
          
          // Poll every 2 seconds
          setTimeout(poll, 2000);
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }
} 

export default PaymentService;