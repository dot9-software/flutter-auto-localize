// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fstat } from "fs";
import * as vscode from "vscode";
import { handleCommand } from "./auto_localize";
import { createKeySuggestion, unquoteString } from "./util";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "flutter-auto-localize" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "flutter-auto-localize.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from flutter_auto_localize!"
      );
    }
  );

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand(
    "flutter-auto-localize.addLocalization",
    handleCommand
  );

  context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
