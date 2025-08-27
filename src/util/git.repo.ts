import * as vscode from "vscode";

export const gitRepo = async () => {
  try {
    // Acessa a extensão Git do VS Code
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      vscode.window.showErrorMessage(vscode.l10n.t("git.extention.lost"));
      return;
    }

    // Ativa a extensão Git e pega a API
    await gitExtension.activate();
    const gitApi = gitExtension.exports.getAPI(1);

    // Verifica se há repositórios Git abertos
    if (gitApi.repositories.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t("not.repo.open"));
      return;
    }

    const repo = gitApi.repositories[0]; // Pega o primeiro repositório

    // Verifica se há mudanças pendentes
    if (
      repo.state.workingTreeChanges.length === 0 &&
      repo.state.indexChanges.length === 0
    ) {
      vscode.window.showInformationMessage(vscode.l10n.t("not.change.to.commit"));
      return;
    }

    // Opcional: Obtém os diffs para enviar ao LM Studio (exemplo)
    return await repo.diff(true); // true para incluir staged changes
  } catch (error) {}
};
