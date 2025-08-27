export function DetailedExample() {
  return `
    Além disso, forneça comentários detalhados para cada mudança, seguindo a estrutura abaixo:

  Exemplos:
  - ✨feat: adiciona validação no formulário
        - Adiciona verificação de campos obrigatórios
        - Implementa feedback visual para erros
  - 🐞fix: corrige bug no login
        - Resolve problema de autenticação em navegadores antigos
        - Ajusta redirecionamento após login
  - 💄style: ajuste nas cores do menu de usuário
        - Muda a cor de fundo do menu para melhorar contraste
        - Atualiza a paleta de cores para o tema claro
  - ♻️refactor: melhora legibilidade da função de cálculo
        - Renomeia variáveis para maior clareza
        - Divide função em subfunções para modularidade
  - 📝docs: adiciona instruções no README
        - Atualiza a seção de instalação
        - Adiciona exemplos de uso
  - ✅test: cria testes unitários para service de autenticação
        - Adiciona testes para verificar fluxo de login
        - Implementa testes de integração para registro de usuários
  - 📦chore: atualiza dependências do projeto
        - Atualiza pacotes para versões mais recentes
        - Remove pacotes não utilizados
  - 🚀perf: melhora desempenho da função de busca
        - Otimiza algoritmos de busca para reduzir tempo de resposta
        - Implementa caching para resultados frequentes
  - 🔧config: adiciona configuração do ESLint
        - Define regras de estilo de código
        - Configura scripts para linting automático
  - 🔒security: corrige vulnerabilidade na autenticação
        - Implementa proteção contra ataques de força bruta
        - Atualiza bibliotecas de segurança
  - 🎨ui: melhora layout da tela de login
        - Redesenha a interface para melhor usabilidade
        - Adiciona animações para transições
  - 🗑️remove: remove código não utilizado
        - Elimina funções obsoletas
        - Limpa arquivos de configuração desnecessários
    `;
}

export function DefaultExample() {
  return `
  Exemplos:
  - ✨feat: adiciona validação no formulário
  - 🐞fix: corrige bug no login
  - 💄style: ajuste nas cores do menu de usuário
  - ♻️refactor: melhora legibilidade da função de cálculo
  - 📝docs: adiciona instruções no README
  - ✅test: cria testes unitários para service de autenticação
  - 📦chore: atualiza dependências do projeto
  - 🚀perf: melhora desempenho da função de busca
  - 🔧config: adiciona configuração do ESLint
  - 🔒security: corrige vulnerabilidade na autenticação
  - 🎨ui: melhora layout da tela de login
  - 🗑️remove: remove código não utilizado
  `;
}

export function DraftExample() {
  return `
  Exemplos:
  - feat: adiciona validação no formulário
  - fix: corrige bug no login
  - style: ajuste nas cores do menu de usuário
  - refactor: melhora legibilidade da função de cálculo
  - docs: adiciona instruções no README
  - test: cria testes unitários para service de autenticação
  - chore: atualiza dependências do projeto
  - perf: melhora desempenho da função de busca
  - config: adiciona configuração do ESLint
  - security: corrige vulnerabilidade na autenticação
  - ui: melhora layout da tela de login
  - remove: remove código não utilizado
  `;
}
