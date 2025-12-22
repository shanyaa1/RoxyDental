import apiClient from './api.client';

export interface PredictionData {
    date: string;
    revenue: number;
    patients: number;
}

export interface PredictionResponse {
    status: string;
    data: PredictionData[];
    message?: string;
}

export interface ChatResponse {
    status: string;
    reply: string;
}

export const aiService = {
    async getPrediction(): Promise<PredictionResponse> {
        try {
            const response = await apiClient.get('/ai/predict', {
                timeout: 30000
            });
            return response.data;
        } catch (error: any) {
            console.error('AI Prediction Error:', error);
            
            if (error.response?.status === 503) {
                return {
                    status: 'error',
                    data: [],
                    message: error.response?.data?.message || 'Layanan prediksi sedang tidak tersedia. Silakan hubungi administrator.'
                };
            }
            
            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                return {
                    status: 'error',
                    data: [],
                    message: 'Request timeout. Silakan coba lagi.'
                };
            }
            
            throw error;
        }
    },

    async chatWithTika(message: string, userName: string = 'User'): Promise<ChatResponse> {
        try {
            const response = await apiClient.post('/ai/chat', { 
                message, 
                user_name: userName 
            }, {
                timeout: 15000
            });
            return response.data;
        } catch (error: any) {
            console.error('AI Chat Error:', error);
            
            if (error.response?.status === 503) {
                return {
                    status: 'error',
                    reply: error.response?.data?.reply || 'Maaf, Tika sedang offline. Silakan coba lagi nanti.'
                };
            }
            
            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                return {
                    status: 'error',
                    reply: 'Tika membutuhkan waktu terlalu lama. Silakan coba lagi.'
                };
            }
            
            if (error.response?.data?.reply) {
                return error.response.data;
            }
            
            return {
                status: 'error',
                reply: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
            };
        }
    }
};