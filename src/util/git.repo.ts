import * as vscode from "vscode";

export const gitRepo = async () => {
  try {
    // Acessa a extensão Git do VS Code
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      vscode.window.showErrorMessage("Extensão Git do VS Code não encontrada!");
      return;
    }

    // Ativa a extensão Git e pega a API
    await gitExtension.activate();
    const gitApi = gitExtension.exports.getAPI(1);

    // Verifica se há repositórios Git abertos
    if (gitApi.repositories.length === 0) {
      vscode.window.showErrorMessage("Nenhum repositório Git aberto!");
      return;
    }

    const repo = gitApi.repositories[0]; // Pega o primeiro repositório

    // Verifica se há mudanças pendentes
    if (
      repo.state.workingTreeChanges.length === 0 &&
      repo.state.indexChanges.length === 0
    ) {
      vscode.window.showInformationMessage("Nenhuma mudança para commitar!");
      return;
    }

    // Opcional: Obtém os diffs para enviar ao LM Studio (exemplo)
    return await repo.diff(true); // true para incluir staged changes
  } catch (error) {}
};
