// src/extension.ts
import * as vscode from "vscode";
import { suggestCommitMessage } from "./commands/suggestCommitMessage";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "ai-commit-suggester.suggestCommitMessage",
    () => suggestCommitMessage(context)
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
