// src/extension.ts
import * as vscode from 'vscode';
import { suggestCommitMessage } from './commands/suggestCommitMessage';

export function activate(context: vscode.ExtensionContext) {
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration('commit-assistant');
  const localModel = config.get<string>('modelosLocais') || '';
  const estiloMensagem = config.get<string>('estiloMensagem') || 'default';
  // Comando para sugerir mensagens de commit
  const suggestCommitDisposable = vscode.commands.registerCommand(
    'commit-assistant.suggestCommitMessage',
    async () => {
      try {
        // Chama a função para sugerir mensagem de commit
        await suggestCommitMessage(context);
      } catch (error: any) {
        vscode.window.showErrorMessage(
          vscode.l10n.t('commit.suggestion.error') + error.message
        );
      }
    }
  );

  // Comando para mostrar configurações
  const showConfigDisposable = vscode.commands.registerCommand(
    'commit-assistant.showConfig',
    () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'commit-assistant'
      );
    }
  );

  context.subscriptions.push(suggestCommitDisposable);
  context.subscriptions.push(showConfigDisposable);
}

export function deactivate() {}
