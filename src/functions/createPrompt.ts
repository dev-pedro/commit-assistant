import {
  DetailedExample,
  DefaultExample,
  DraftExample,
} from './example.commit';

export function createPrompt(
  diff: string,
  commitExample?: string,
  commitIdiom?: 'en' | 'pt'
): string {
  let example = '';
  switch (commitExample) {
    case 'detailed':
      example = DetailedExample();
      break;
    case 'draft':
      example = DraftExample();
      break;
    default:
      example = DefaultExample();
      break;
  }

  // Definindo a mensagem base do prompt com base no idioma
  const basePrompt = {
    en: `
Generate only ONE short and objective commit message (maximum 15 words).
Always use a corresponding icon at the beginning, following the examples below:

${example}

Now, for the following changes:
${diff}

Reply with just the commit message, no explanations, no line breaks, and always starting with the appropriate icon.
`,
    pt: `
Gere apenas UMA mensagem de commit curta e objetiva (máximo 15 palavras).
Sempre use um ícone correspondente no início, seguindo os exemplos abaixo:

${example}

Agora, para as seguintes alterações:
${diff}

Responda apenas com a mensagem de commit, sem explicações, sem quebras de linha e sempre começando com o ícone apropriado.
`,
  };

  // Retorna o prompt no idioma correspondente, ou em inglês se o idioma não for suportado
  return basePrompt[commitIdiom || 'en'] || basePrompt.en;
}
