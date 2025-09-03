import axios from "axios";

// Função para obter modelos ativos do LM Studio
export async function obterModelosAtivosDoLMstudio(): Promise<string[]> {
  try {
    const response = await axios.get('http://localhost:1234/v1/models');
    // Verifica se a resposta está no formato esperado
    if (response.data && response.data.data) {
      const modelosAtivos = response.data.data.map(
        (modelo: { id: string }) => modelo.id
      );
      return modelosAtivos;
    } else {
      console.error('Formato de resposta inesperado:', response.data);
      return []; // Retorna um array vazio em caso de erro
    }
  } catch (error: any) {
    console.error(
      'Erro ao obter modelos ativos:',
      error.response?.data || error.message
    );
    return []; // Retorna um array vazio em caso de erro
  }
}
