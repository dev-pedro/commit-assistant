// src/commands/suggestCommitMessage.ts
import * as vscode from "vscode";
import { getGitApi, checkForChanges } from "../git/gitHelper";
import { generateCommitMessage } from "../api/apiClient";
import { createPrompt } from "../functions/createPrompt";
import axios from "axios";

export async function suggestCommitMessage(context: vscode.ExtensionContext) {
  // Obter configurações atuais
  const config = vscode.workspace.getConfiguration("commit-assistant");
  const modeloLocal = config.get<string>("modelosLocais") || "";
  const messageStyle = config.get<string>("messageStyle") || "default";
  const notificacoesHabilitadas = config.get<boolean>("enableNotifications");

  try {
    const gitApi = getGitApi();
    const repo = gitApi.repositories[0];

    if (!repo) {
      notificacoesHabilitadas &&
        vscode.window.showErrorMessage(vscode.l10n.t("not.repo.open"));
      return;
    }

    if (!checkForChanges(repo)) {
      // Nenhuma mudança para commitar
      notificacoesHabilitadas &&
        vscode.window.showInformationMessage(
          vscode.l10n.t("not.change.to.commit")
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
            vscode.l10n.t("multi.model.info", modeloLocal)
          );
        // Gerar mensagem de commit com o modelo local
        const suggestedMessage = await generateCommitMessage(
          modeloLocal,
          prompt
        );
        repo.inputBox.value = suggestedMessage;
        await vscode.commands.executeCommand("workbench.scm.focus");
        notificacoesHabilitadas &&
          vscode.window.showInformationMessage(
            vscode.l10n.t("commit.message.inserted", suggestedMessage)
          );
        return;
      } else {
        // Perguntar ao usuário qual modelo deseja usar
        const modeloEscolhido = await vscode.window.showQuickPick(
          modelosAtivos.map((m) => `• ${m}`),
          {
            title: vscode.l10n.t("model.choose.title"),
            placeHolder: vscode.l10n.t("multi.model.choose.placeholder"),
          }
        );

        if (!modeloEscolhido) {
          vscode.window.showWarningMessage(
            vscode.l10n.t("multi.model.none.selected")
          );
          return;
        }

        // Remover o bullet "• " e salvar só o nome do modelo
        const modeloFinal = modeloEscolhido.replace("• ", "");

        // Salvar escolha do usuário nas configurações
        await config.update(
          "modelosLocais",
          modeloFinal,
          vscode.ConfigurationTarget.Global
        );

        vscode.window.showInformationMessage(
          vscode.l10n.t("multi.model.saved", modeloFinal)
        );

        // Gerar mensagem de commit com o modelo escolhido
        const suggestedMessage = await generateCommitMessage(
          modeloFinal,
          prompt
        );
        repo.inputBox.value = suggestedMessage;
        await vscode.commands.executeCommand("workbench.scm.focus");
        vscode.window.showInformationMessage(
          vscode.l10n.t("commit.message.inserted", suggestedMessage)
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
    await vscode.commands.executeCommand("workbench.scm.focus");
    vscode.window.showInformationMessage(
      vscode.l10n.t("commit.message.inserted", suggestedMessage)
    );
  } catch (error) {
    vscode.window.showErrorMessage(vscode.l10n.t("lm.studio.error"));
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
    const response = await axios.get("http://localhost:1234/v1/models");

    // Extrair os IDs dos modelos da resposta
    const modelosAtivos = response.data.data.map(
      (modelo: { id: string }) => modelo.id
    );

    return modelosAtivos;
  } catch (error) {
    console.error("Erro ao obter modelos ativos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}
