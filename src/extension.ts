import * as vscode from "vscode";
import { suggestCommitMessage } from "./commands/suggestCommitMessage";

export function activate(context: vscode.ExtensionContext) {
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration("commit-assistant");
  const localModel = config.get<string>("modelosLocais") || "";
  const estiloMensagem = config.get<string>("estiloMensagem") || "default";

  // Comando para sugerir mensagens de commit
  const suggestCommitDisposable = vscode.commands.registerCommand(
    "commit-assistant.suggestCommitMessage",
    () => suggestCommitMessage(context)
  );

  // Comando para mostrar configurações
  const showConfigDisposable = vscode.commands.registerCommand(
    "commit-assistant.showConfig",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "configWebview", // Identificador do Webview
        "Configurações do CommitAssistant", // Título do Webview
        vscode.ViewColumn.One, // Coluna onde o Webview será exibido
        {
          enableScripts: true, // Permitir execução de scripts
        }
      );

      console.log("Modelos Locais:", localModel);
      console.log("Estilo da Mensagem:", estiloMensagem);

      // Criar HTML para o Webview
      panel.webview.html = getWebviewContent(localModel, estiloMensagem);

      // Receber mensagens do Webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "saveConfig":
              // Salvar configurações
              const newModelosLocais = message.modelosLocais;
              const newEstiloMensagem = message.estiloMensagem;

              // Atualizar configurações
              vscode.workspace
                .getConfiguration("commit-assistant")
                .update(
                  "modelosLocais",
                  newModelosLocais,
                  vscode.ConfigurationTarget.Global
                );
              vscode.workspace
                .getConfiguration("commit-assistant")
                .update(
                  "estiloMensagem",
                  newEstiloMensagem,
                  vscode.ConfigurationTarget.Global
                );
              vscode.window.showInformationMessage(
                "Configurações salvas com sucesso!"
              );
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(suggestCommitDisposable);
  context.subscriptions.push(showConfigDisposable);
}

export function deactivate() {}

function getWebviewContent(localModel: string, estiloMensagem: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Configurações do CommitAssistant</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        label { display: block; margin: 10px 0 5px; }
        input, select { width: 100%; padding: 8px; margin-bottom: 20px; }
        button { padding: 10px 15px; }
      </style>
    </head>
    <body>
      <h1>Configurações do CommitAssistant</h1>
      <label for="modelosLocais">Modelo Local:</label>
      <input placeholder="llama-3.2-3b-instruct" type="text" id="modelosLocais" value="${localModel}">
      
      <label for="estiloMensagem">Estilo da Mensagem:</label>
      <select id="estiloMensagem">
        <option value="default" ${
          estiloMensagem === "default" ? "selected" : ""
        }>Padrão</option>
        <option value="detailed" ${
          estiloMensagem === "detailed" ? "selected" : ""
        }>Detalhado</option>
        <option value="draft" ${
          estiloMensagem === "draft" ? "selected" : ""
        }>Rascunho</option>
      </select>
      
      <button id="saveButton">Salvar Configurações</button>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('saveButton').addEventListener('click', () => {
          const modelosLocais = document.getElementById('modelosLocais').value.trim(); // Agora trata como uma string única
          const estiloMensagem = document.getElementById('estiloMensagem').value;
          vscode.postMessage({ command: 'saveConfig', modelosLocais, estiloMensagem });
        });
      </script>
    </body>
    </html>
  `;
}
