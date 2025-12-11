// src/commands/suggestCommitMessage.ts
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { checkForChanges, getGitApi } from '../git/gitHelper';
import { generateCommitMessage as generateWithLMStudio } from '../api/apiClient';
import { generateCommitMessageWithGoogle, listGoogleModels } from '../api/googleApiClient';
import { createPrompt } from '../functions/createPrompt';
import { obterModelosAtivosDoLMstudio } from '../functions/get.atctive.models';
import { summarizeDiff } from '../functions/summarizeDiff';

export async function suggestCommitMessage(context: vscode.ExtensionContext) {
  // Obter traduções
  const localize = nls.loadMessageBundle();
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration('CommitAssistant');
  const apiProvider =
    config.get<'LM Studio' | 'Google'>('apiProvider') || 'LM Studio';
  const googleApiKey = config.get<string>('apiKey') || '';
  let googleModel = config.get<string>('googleModel') || 'gemini-1.5-flash-latest';
  const modeloLocal = config.get<string>('localModel') || '';
  const messageStyle = config.get<string>('messageStyle') || 'default';
  const notificacoesHabilitadas = config.get<boolean>('enableNotifications', true);
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

    let suggestedMessage = '';
    if (apiProvider === 'Google') {
      if (!googleApiKey) {
        const configureApiKey = localize('configure.api.key', 'Configure API Key');
        const useLmStudio = localize('use.lm.studio', 'Use LM Studio Instead');
        const selection = await vscode.window
          .showErrorMessage(
            localize(
              'google.api.key.not.found',
              'Google API Key not found. Please configure it in the settings.'
            ),
            configureApiKey,
            useLmStudio
          );

        if (selection === configureApiKey) {
          vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'CommitAssistant.apiKey'
          );
          return;
        } else if (selection === useLmStudio) {
          // Altera o provedor para LM Studio e continua a execução
          await config.update('apiProvider', 'LM Studio', vscode.ConfigurationTarget.Global);
          vscode.window.showInformationMessage(localize('provider.switched.lmstudio', 'Provider switched to LM Studio.'));
          // Chama a função novamente para reiniciar o fluxo com o novo provedor.
          await suggestCommitMessage(context);
        }
        return; // Cancela a operação se o usuário não escolher nada
      }
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: localize(
          'generating.commit.google',
          'Generating commit message with Google...'
        ),
        cancellable: false,
      },
        async (progress) => {
          try {
            suggestedMessage = await generateCommitMessageWithGoogle(
              googleApiKey,
              googleModel,
              prompt
            );
          } catch (error: any) {
            // Se o modelo não for encontrado, oferece a seleção de um novo.
            if (error.message.includes('404') || error.message.includes('not found')) {
              progress.report({ message: localize('google.model.not.found.retrying', 'Model not found, fetching available models...') });

              const availableModels = await listGoogleModels(googleApiKey);
              if (availableModels.length === 0) {
                vscode.window.showErrorMessage(localize('google.no.models.available', 'No compatible Google models found.'));
                return;
              }

              const selectedModel = await vscode.window.showQuickPick(
                availableModels.map(m => ({ label: m.displayName, description: m.name })),
                {
                  title: localize('google.model.choose.title', 'Choose a Google Model'),
                  placeHolder: localize('google.model.choose.placeholder', 'The configured model was not found. Please select a new one.'),
                }
              );

              if (selectedModel) {
                googleModel = selectedModel.description; // 'description' contém o nome real do modelo
                await config.update('googleModel', googleModel, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(localize('google.model.saved', 'Google model saved: {0}', googleModel));

                // Tenta gerar a mensagem novamente com o novo modelo
                progress.report({ message: localize('generating.commit.google.new.model', 'Generating commit message with {0}...', googleModel) });
                suggestedMessage = await generateCommitMessageWithGoogle(
                  googleApiKey,
                  googleModel,
                  prompt
                );
              } else {
                // Usuário cancelou a seleção
                return;
              }
            } else {
              // Outro tipo de erro da API
              throw error;
            }
          }
        }
      );
    } else if (apiProvider === 'LM Studio') {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: localize(
            'generating.commit.lmstudio',
            'Generating commit message with LM Studio...'
          ),
          cancellable: false,
        },
        async () => {
          suggestedMessage = await handleLMStudio(
            localize,
            context,
            config,
            prompt,
            notificacoesHabilitadas
          );
        }
      );
    } else {
      // Provedor desconhecido, pode ser um erro de configuração.
    }

    // Verificar modelos ativos
    /* const modelosAtivos = await obterModelosAtivosDoLMstudio();

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
        const suggestedMessage = await generateWithLMStudio(
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
        const suggestedMessage = await generateWithLMStudio(
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
    const suggestedMessage = await generateWithLMStudio(
      modelosAtivos[0],
      prompt
    );
 */
    if (suggestedMessage === 'Try commit a small change.') {
      vscode.window.showErrorMessage(
        localize(
          'lm.studio.error.message.size',
          'Error to generate a commit message: Try commit a small change.'
        )
      );
      return;
    } else if (suggestedMessage) {
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
        'commit.suggestion.error',
        'Commit Assistant: Error suggesting message: {0}',
        error.message
      )
    );
  }
}

async function handleLMStudio(
  localize: nls.LocalizeFunc,
  context: vscode.ExtensionContext,
  config: vscode.WorkspaceConfiguration,
  prompt: string,
  notificacoesHabilitadas: boolean | undefined
): Promise<string> {
  const modeloLocal = config.get<string>('localModel') || '';
  const modelosAtivos = await obterModelosAtivosDoLMstudio();

  if (modelosAtivos.length === 0) {
    const useGoogle = localize('use.google.provider', 'Use Google Instead');
    const openLmStudio = localize('open.lmstudio.guide', 'How to use LM Studio?');
    const selection = await vscode.window.showWarningMessage(
      localize('lm.studio.not.running', 'LM Studio is not running or has no models loaded.'),
      useGoogle,
      openLmStudio
    );

    if (selection === useGoogle) {
      await config.update('apiProvider', 'Google', vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(localize('provider.switched.google', 'Provider switched to Google.'));
      // Chama a função principal novamente para reiniciar o fluxo com o provedor Google.
      await suggestCommitMessage(context);
      return ''; // Retorna uma string vazia pois a chamada recursiva cuidará da geração.
    }

    if (selection === openLmStudio) {
      vscode.env.openExternal(vscode.Uri.parse('https://lmstudio.ai/'));
    }

    return ''; // Cancela a operação se o usuário não escolher uma ação que continue o fluxo.
  }

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
      return await generateWithLMStudio(modeloLocal, prompt);
    } else {
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
        return '';
      }

      const modeloFinal = modeloEscolhido.replace('• ', '');

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

      return await generateWithLMStudio(modeloFinal, prompt);
    }
  }

  // Apenas um modelo ativo
  const activeModel = modelosAtivos[0];
  if (modeloLocal !== activeModel) {
    await config.update(
      'localModel',
      activeModel,
      vscode.ConfigurationTarget.Global
    );
    notificacoesHabilitadas &&
      vscode.window.showInformationMessage(
        localize(
          'multi.model.saved',
          'Commit Assistant: Model saved: {0}',
          activeModel
        )
      );
  }

  return await generateWithLMStudio(activeModel, prompt);
}
