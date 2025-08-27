import {
  DetailedExample,
  DefaultExample,
  DraftExample,
} from "./example.commit";

export function createPrompt(diff: string, exampleDeatil?: string): string {
  let example = "";
  switch (exampleDeatil) {
    case "detailed":
      example = DetailedExample();
      break;
    case "draft":
      example = DraftExample();
      break;
    default:
      example = DefaultExample();
      break;
  }
  exampleDeatil === "detailed" ? DetailedExample() : DefaultExample();

  const basePrompt = `
Gere apenas UMA mensagem de commit curta e objetiva (máximo 15 palavras).
Use sempre um ícone correspondente no início, seguindo os exemplos abaixo:

${example}

Agora, para as seguintes alterações:
${diff}

Responda apenas com a mensagem de commit, sem explicações, sem quebras de linha, 
e sempre iniciando com o ícone adequado.
`;
  return basePrompt;
}
