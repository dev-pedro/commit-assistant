// src/commands/suggestCommitMessage.ts
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { getGitApi, checkForChanges } from '../git/gitHelper';
import { generateCommitMessage } from '../api/apiClient';
import { createPrompt } from '../functions/createPrompt';
import { obterModelosAtivosDoLMstudio } from '../functions/get.atctive.models';
import { summarizeDiff } from '../functions/summarizeDiff';

export async function suggestCommitMessage(context: vscode.ExtensionContext) {
  // Obter traduções
  const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration('CommitAssistant');
  const modeloLocal = config.get<string>('localModel') || '';
  const messageStyle = config.get<string>('messageStyle') || 'default';
  const notificacoesHabilitadas = config.get<boolean>('enableNotifications');
  const commitIdiom = config.get<'en' | 'pt'>('commitIdiom') || 'en';
  try {
    const gitApi = getGitApi();
    let repo = gitApi.activeRepository;

    // Verificar se o comando foi executado a partir de um clique em um arquivo
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
      // Obter o caminho do arquivo ativo
      const filePath = activeTextEditor.document.uri.fsPath;

      // Encontrar o repositório correspondente ao arquivo ativo
      repo = gitApi.repositories.find((r: any) =>
        filePath.startsWith(r.rootUri.fsPath)
      );
    }

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
      repo = gitApi.repositories[0];
      return;
    }

    const diff = await repo.diff(true);
    // Se o diff for muito grande, gera um resumo
    console.log(`Diff length: ${diff.split('\n').length} lines`);
    console.log(`Message style: `, messageStyle);
    const diffToUse = diff && diff.split('\n').length > 200 ? summarizeDiff(diff, 200) : diff;
    const prompt = createPrompt(diffToUse, messageStyle, commitIdiom);

    // Verificar modelos ativos
    const modelosAtivos = await obterModelosAtivosDoLMstudio();

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
          'localModel',
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

    if (suggestedMessage === 'Try commit a small change.') {
      vscode.window.showErrorMessage(
        localize(
          'lm.studio.error.message.size',
          'Error to generate a commit message: Try commit a small change.'
        )
      );
      return;
    } else {
      repo.inputBox.value = suggestedMessage;
      await vscode.commands.executeCommand('workbench.scm.focus');
      vscode.window.showInformationMessage(
        localize(
          'commit.message.inserted',
          'Commit Assistant: Message inserted',
          suggestedMessage
        )
      );
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(
      localize(
        'lm.studio.error',
        'Please check if LM Studio is running {0}.',
        error
      )
    );
  }
}
