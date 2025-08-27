// src/git/gitHelper.ts
import * as vscode from "vscode";

export function getGitApi() {
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (!gitExtension) {
    vscode.window.showErrorMessage(vscode.l10n.t("not.repo.open"));
    throw new Error("Git extension not found");
  }
  gitExtension.activate();
  return gitExtension.exports.getAPI(1);
}

export function checkForChanges(repo: any): boolean {
  return repo.state.workingTreeChanges.length > 0 || repo.state.indexChanges.length > 0;
}
