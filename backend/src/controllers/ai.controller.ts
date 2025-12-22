import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_TIMEOUT = 30000; // 30 seconds

const checkAIServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { 
      timeout: 5000 
    });
    return response.status === 200;
  } catch {
    return false;
  }
};

export const getPrediction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if AI service is available
    const isHealthy = await checkAIServiceHealth();
    
    if (!isHealthy) {
      console.error('❌ AI Service is not available at:', AI_SERVICE_URL);
      return res.status(503).json({
        status: 'error',
        message: 'Layanan prediksi sedang tidak tersedia. Pastikan AI Service berjalan di ' + AI_SERVICE_URL,
        data: []
      });
    }

    const response = await axios.get(`${AI_SERVICE_URL}/predict`, {
      timeout: AI_TIMEOUT,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Prediction Error:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          status: 'error',
          message: `AI Service tidak dapat dijangkau di ${AI_SERVICE_URL}. Pastikan service berjalan dengan: cd roxydental-ai && uvicorn api:app --reload`,
          data: []
        });
      }
      
      if (axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED') {
        return res.status(504).json({
          status: 'error',
          message: 'Request timeout. AI Service membutuhkan waktu terlalu lama.',
          data: []
        });
      }
      
      if (axiosError.response) {
        return res.status(axiosError.response.status).json(
          axiosError.response.data || { 
            status: 'error', 
            message: 'Gagal mendapatkan prediksi dari AI Service',
            data: []
          }
        );
      }
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server',
      data: []
    });
  }
};

export const chatTika = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, user_name } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        status: 'error',
        reply: 'Pesan tidak boleh kosong'
      });
    }

    // Check if AI service is available
    const isHealthy = await checkAIServiceHealth();
    
    if (!isHealthy) {
      console.error('❌ AI Service is not available at:', AI_SERVICE_URL);
      return res.status(503).json({
        status: 'error',
        reply: 'Maaf, Tika sedang offline. Pastikan AI Service berjalan di ' + AI_SERVICE_URL
      });
    }
    
    const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
      message: message.trim(),
      user_name: user_name || 'User'
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Chat Error:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          status: 'error',
          reply: `Tika sedang offline. Pastikan AI Service berjalan di ${AI_SERVICE_URL}`
        });
      }
      
      if (axiosError.code === 'ETIMEDOUT' || axiosError.code === 'ECONNABORTED') {
        return res.status(504).json({
          status: 'error',
          reply: 'Tika membutuhkan waktu lebih lama untuk merespons. Silakan coba lagi.'
        });
      }
      
      if (axiosError.response) {
        return res.status(axiosError.response.status).json(
          axiosError.response.data || {
            status: 'error',
            reply: 'Maaf, Tika mengalami gangguan teknis.'
          }
        );
      }
    }
    
    return res.status(500).json({
      status: 'error',
      reply: 'Terjadi kesalahan sistem. Silakan coba lagi nanti.'
    });
  }
};