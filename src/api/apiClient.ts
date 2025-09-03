// src/api/apiClient.ts
import apiClient from './axiosConfig'; // Importe a instância do Axios

export async function generateCommitMessage(
  model: string,
  prompt: string
): Promise<string> {
  try {
    const response = await apiClient.post('/chat/completions', { // Use a instância configurada
      model: model,
      messages: [
        {
          role: 'system',
          content:
            'You are a wizard who generates clear and straightforward commit messages.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.4,
    });

    let message = 'Default Commit message.';
    if (response.data.choices && response.data.choices.length > 0) {
      message = response.data.choices[0].message?.content || message;
    }

    return message;
  } catch (error) {
    return 'Try commit a small change.';
  }
}
