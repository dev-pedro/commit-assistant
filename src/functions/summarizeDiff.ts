// src/functions/summarizeDiff.ts
// Função para resumir um diff grande em um formato amigável para LLMs
export function summarizeDiff(diff: string, maxLines: number = 200): string {
  if (!diff) { return ''; }
  const lines = diff.split('\n');
  if (lines.length <= maxLines) { return diff; }

  // Resumo por arquivo
  const fileSummaries: string[] = [];
  let currentFile = '';
  let added = 0, removed = 0, changed = 0;
  let fileLines: string[] = [];
  const flush = () => {
    if (!currentFile) { return; }
    // Pega as primeiras e últimas 5 linhas do diff do arquivo
    const preview = fileLines.slice(0, 5).concat(['...'], fileLines.slice(-5)).join('\n');
    fileSummaries.push(
      `Arquivo: ${currentFile}\n+${added} -${removed} ~${changed}\nTrecho:\n${preview}`
    );
    added = 0; removed = 0; changed = 0; fileLines = [];
  };
  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      flush();
      const match = line.match(/ b\/(.*)$/);
      currentFile = match ? match[1] : line;
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      added++;
      fileLines.push(line);
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      removed++;
      fileLines.push(line);
    } else if (line.startsWith('@@')) {
      changed++;
      fileLines.push(line);
    } else {
      fileLines.push(line);
    }
  }
  flush();
  return (
    'Resumo das mudanças (diff grande):\n' +
    fileSummaries.join('\n\n') +
    `\n\n[Resumo gerado automaticamente para evitar limite de tokens]`
  );
}