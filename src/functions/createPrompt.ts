import { ExampleDetail } from "../types/type";
import { FurtherDetails, lessDetailsExample } from "./example.commit";

export function createPrompt(
  diff: string,
  exampleDeatil?: ExampleDetail
): string {
  console.log("DIFF recebido: ", diff);
  const example =
    exampleDeatil === ExampleDetail.FURTHER
      ? FurtherDetails()
      : lessDetailsExample();

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
