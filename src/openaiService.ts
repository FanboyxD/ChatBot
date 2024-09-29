import axios, { AxiosError } from 'axios';
import { OPENAI_API_KEY } from '@env';

const api = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (message: string): Promise<string> => {
  const maxRetries = 5;
  let attempt = 0;
  let delay = 1000; // Comienza con 1 segundo de retraso

  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1}: Sending request to OpenAI API...`);
      const response = await api.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });
      console.log('Response received successfully');
      return response.data.choices[0].message.content;
    } catch (error) {
      const axiosError = error as AxiosError;
      attempt++;

      console.error(`Error on attempt ${attempt}:`, axiosError.message);
      console.error('Response status:', axiosError.response?.status);
      console.error('Response data:', axiosError.response?.data);

      if (axiosError.response?.status === 429) {
        console.warn(`Rate limit exceeded. Attempt ${attempt} of ${maxRetries}. Waiting for ${delay} ms before retrying...`);
        await wait(delay);
        delay *= 2; // Implementa un retraso exponencial
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries reached while trying to send message to OpenAI');
};