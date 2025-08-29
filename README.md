# Commit Assistant - AI Local Models

Gere automaticamente mensagens de commit claras e concisas para suas alterações no Git, utilizando modelos de IA locais integrados ao VS Code.

## Funcionalidades
- Sugestão automática de mensagens de commit com base nas alterações do repositório.
- Suporte a múltiplos modelos locais via LM Studio.
- Escolha do estilo da mensagem (padrão, detalhada, rascunho).
- Notificações configuráveis para feedback rápido.
- Interface amigável integrada ao SCM do VS Code.

## Requisitos
- [LM Studio](https://lmstudio.ai/) instalado e rodando localmente (porta padrão: 1234).
- Node.js e npm instalados para desenvolvimento.
- Git instalado e repositório aberto no VS Code.

## Instalação
1. Clone o repositório:
   ```sh
   git clone https://github.com/dev-pedro/commit-assistant.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Compile a extensão:
   ```sh
   npm run compile
   ```
4. Inicie o LM Studio e carregue o(s) modelo(s) desejado(s).
5. Execute e teste a extensão no VS Code (F5 para modo desenvolvimento).

## Como Usar
- Abra o menu de SCM (controle de código-fonte) no VS Code.
- Clique no botão "Gerar sugestão de commit" ou execute o comando `Commit Assistant: Generate Commit Suggestion`.
- Caso haja mais de um modelo ativo, escolha o modelo desejado.
- A mensagem sugerida será inserida automaticamente no campo de commit.

## Configurações
A extensão oferece as seguintes opções em `settings.json`:
- `CommitAssistant.localModel`: Modelo local padrão para sugestões.
- `CommitAssistant.messageStyle`: Estilo da mensagem (`default`, `detailed`, `draft`).
- `CommitAssistant.enableNotifications`: Ativa/desativa notificações.
- `CommitAssistant.commitIdiom`: Idioma da mensagem (`en`, `pt`).

## Exemplos
- Sugestão de commit
![Sugestão de commit](/images/message-commit.png)
- Escolha de modelo
![Escolha de modelo](/images/select-model.png)

## Problemas Conhecidos
- O comando "Mostrar configurações do Commit Assistant" precisa ser implementado para funcionar corretamente.
- Certifique-se de que o LM Studio está rodando e que há modelos carregados.

## Notas de Lançamento
### 1.0.0
- Primeira versão estável com sugestão automática de mensagens de commit.

---
Para dúvidas ou sugestões, abra uma issue no [GitHub](https://github.com/dev-pedro/commit-assistant).
