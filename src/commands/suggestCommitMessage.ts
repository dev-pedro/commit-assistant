// src/commands/suggestCommitMessage.ts
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { getGitApi, checkForChanges } from '../git/gitHelper';
import { generateCommitMessage } from '../api/apiClient';
import { createPrompt } from '../functions/createPrompt';
import axios from 'axios';

export async function suggestCommitMessage(context: vscode.ExtensionContext) {
  // Obter traduções
  const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration('CommitAssistant');
  const modeloLocal = config.get<string>('LocalModel') || '';
  const messageStyle =
    config.get<string>('CommitAssistant.MessageStyle') || 'default';
  const notificacoesHabilitadas = config.get<boolean>('enableNotifications');

  console.log('Modelo Local:', modeloLocal);
  console.log('Message Style:', messageStyle);
  console.log('Enable Notifications:', notificacoesHabilitadas);
  try {
    const gitApi = getGitApi();
    const repo = gitApi.repositories[0];

    if (!repo) {
      notificacoesHabilitadas &&
        vscode.window.showErrorMessage(
          localize('not.repo.open', 'No open Git repository!')
        );
      return;
    }

    if (!checkForChanges(repo)) {
      // Nenhuma mudança para commitar
      notificacoesHabilitadas &&
        vscode.window.showInformationMessage(
          localize('not.change.to.commit', 'No changes to commit!')
        );
      return;
    }

    const diff = await repo.diff(true);
    const prompt = createPrompt(diff, messageStyle);

    // Verificar modelos ativos
    const modelosAtivos = await verificarModelosAtivos();

    if (modelosAtivos.length > 1) {
      if (modelosAtivos.includes(modeloLocal)) {
        notificacoesHabilitadas &&
          vscode.window.showInformationMessage(
            localize(
              'multi.model.info',
              'Commit Assistant: Model used: {0}.',
              modeloLocal
            )
          );
        // Gerar mensagem de commit com o modelo local
        const suggestedMessage = await generateCommitMessage(
          modeloLocal,
          prompt
        );
        repo.inputBox.value = suggestedMessage;
        await vscode.commands.executeCommand('workbench.scm.focus');
        notificacoesHabilitadas &&
          vscode.window.showInformationMessage(
            localize(
              'commit.message.inserted',
              'Commit Assistant: Message inserted',
              suggestedMessage
            )
          );
        return;
      } else {
        // Perguntar ao usuário qual modelo deseja usar
        const modeloEscolhido = await vscode.window.showQuickPick(
          modelosAtivos.map((m) => `• ${m}`),
          {
            title: localize(
              'model.choose.title',
              'Choose the active model to use'
            ),
            placeHolder: localize(
              'multi.model.choose.placeholder',
              'Select a model...'
            ),
          }
        );

        if (!modeloEscolhido) {
          vscode.window.showWarningMessage(
            localize(
              'multi.model.none.selected',
              'No model selected. Operation cancelled.'
            )
          );
          return;
        }

        // Remover o bullet "• " e salvar só o nome do modelo
        const modeloFinal = modeloEscolhido.replace('• ', '');

        // Salvar escolha do usuário nas configurações
        await config.update(
          'LocalModel',
          modeloFinal,
          vscode.ConfigurationTarget.Global
        );

        vscode.window.showInformationMessage(
          localize(
            'multi.model.saved',
            'Commit Assistant: Model saved: {0}',
            modeloFinal
          )
        );

        // Gerar mensagem de commit com o modelo escolhido
        const suggestedMessage = await generateCommitMessage(
          modeloFinal,
          prompt
        );
        repo.inputBox.value = suggestedMessage;
        await vscode.commands.executeCommand('workbench.scm.focus');
        vscode.window.showInformationMessage(
          localize(
            'commit.message.inserted',
            'Commit Assistant: Message inserted',
            suggestedMessage
          )
        );
        return;
      }
    }

    // Se apenas um modelo está ativo, chama a função para gerar a mensagem
    const suggestedMessage = await generateCommitMessage(
      modelosAtivos[0],
      prompt
    );
    repo.inputBox.value = suggestedMessage;
    await vscode.commands.executeCommand('workbench.scm.focus');
    vscode.window.showInformationMessage(
      localize(
        'commit.message.inserted',
        'Commit Assistant: Message inserted',
        suggestedMessage
      )
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      localize('lm.studio.error', 'Please check if LM Studio is running.')
    );
  }
}

// Função para verificar quais modelos estão ativos
async function verificarModelosAtivos(): Promise<string[]> {
  const modelosAtivos = await obterModelosAtivosDoLMstudio();
  return modelosAtivos;
}

// Função para obter modelos ativos do LM Studio
async function obterModelosAtivosDoLMstudio(): Promise<string[]> {
  try {
    const response = await axios.get('http://localhost:1234/v1/models');

    // Extrair os IDs dos modelos da resposta
    const modelosAtivos = response.data.data.map(
      (modelo: { id: string }) => modelo.id
    );

    return modelosAtivos;
  } catch (error) {
    console.error('Erro ao obter modelos ativos:', error);
    return []; // Retorna um array vazio em caso de erro
  }
}
