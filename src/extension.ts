// src/extension.ts
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { suggestCommitMessage } from './commands/suggestCommitMessage';

export function activate(context: vscode.ExtensionContext) {
  // Obter traduções
  const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
  // Comando para sugerir mensagens de commit
  const suggestCommitDisposable = vscode.commands.registerCommand(
    'commit-assistant.suggestCommitMessage',
    async () => {
      try {
        // Chama a função para sugerir mensagem de commit
        await suggestCommitMessage(context);
      } catch (error: any) {
        vscode.window.showErrorMessage(
          localize(
            'commit.suggestion.error',
            'Error commit message: {0}',
            error.message
          )
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
