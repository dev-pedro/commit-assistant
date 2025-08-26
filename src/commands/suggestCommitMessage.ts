// src/commands/suggestCommitMessage.ts
import * as vscode from "vscode";
import { getGitApi, checkForChanges } from "../git/gitHelper";
import { generateCommitMessage } from "../api/apiClient";
import { ExampleDetail } from "../types/type";
import { createPrompt } from "../functions/createPrompt";

export async function suggestCommitMessage(context: vscode.ExtensionContext) {
  const model = "llama-3.2-3b-instruct";
  try {
    const gitApi = getGitApi();
    const repo = gitApi.repositories[0];

    if (!repo) {
      vscode.window.showErrorMessage("Nenhum repositório Git aberto!");
      return;
    }

    if (!checkForChanges(repo)) {
      vscode.window.showInformationMessage("Nenhuma mudança para commitar!");
      return;
    }

    const diff = await repo.diff(true);
    const prompt = createPrompt(diff, ExampleDetail.FURTHER);

    const suggestedMessage = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "🤖 Gerando sua mensagem de commit...",
        cancellable: false,
      },
      async () => await generateCommitMessage(model, prompt)
    );

    repo.inputBox.value = suggestedMessage;
    await vscode.commands.executeCommand("workbench.scm.focus");
    vscode.window.showInformationMessage(
      `Mensagem sugerida inserida: ${suggestedMessage}`
    );
  } catch (error) {
    console.error("Erro ao gerar mensagem de commit:", error);
    vscode.window.showErrorMessage(
      "Erro. Verifique se o LM Studio está rodando."
    );
  }
}
