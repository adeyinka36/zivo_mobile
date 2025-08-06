import { api } from '../app/context/auth';
import { 
  PaymentIntent, 
  PaymentStatus, 
  PaymentHistory, 
  RefundRequest, 
  RefundResponse,
  PaymentMetadata,
  PaymentIntentResponse,
  UploadAfterPaymentRequest
} from '../types/payment';

export class PaymentService {
  /**
   * Create payment intent with metadata only (no file upload)
   */
  static async createPaymentIntent(metadata: PaymentMetadata): Promise<PaymentIntentResponse> {
    try {
      const response = await api.post('/media/payment-intent', metadata);
      const result = response.data.payment_intent || response.data;
      return result;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  }

  /**
   * Upload media after successful payment
   */
  static async uploadAfterPayment(request: UploadAfterPaymentRequest): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('payment_id', request.payment_id);
      formData.append('file', request.file);
      formData.append('description', request.description);
      
      request.tags.forEach(tag => formData.append('tags[]', tag));
      formData.append('reward', request.reward.toString());
      
      request.questions.forEach((question, index) => {
        formData.append(`questions[${index}][question]`, question.question);
        formData.append(`questions[${index}][answer]`, question.answer);
        formData.append(`questions[${index}][option_a]`, question.option_a);
        formData.append(`questions[${index}][option_b]`, question.option_b);
        formData.append(`questions[${index}][option_c]`, question.option_c);
        formData.append(`questions[${index}][option_d]`, question.option_d);
      });

      const response = await api.post('/media/upload-after-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload media');
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return response.data;
    } catch (error: any) {
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
      throw new Error(error.response?.data?.message || 'Failed to get payment history');
    }
  }

  /**
   * Request refund
   */
  static async requestRefund(paymentId: string, request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, request);
      return response.data.data || response.data;
    } catch (error: any) {
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