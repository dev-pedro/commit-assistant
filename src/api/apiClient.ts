// src/api/apiClient.ts
import axios from 'axios';

export async function generateCommitMessage(
  model: string,
  prompt: string
): Promise<string> {
  const response = await axios.post(
    'http://127.0.0.1:1234/v1/chat/completions',
    {
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente que gera mensagens de commit claras e objetivas.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.4,
    }
  );

  let message = 'Mensagem de commit padrão';
  if (response.data.choices && response.data.choices.length > 0) {
    message = response.data.choices[0].message?.content || message;
  }

  return message;
}
