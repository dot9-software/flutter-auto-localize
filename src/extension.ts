// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fstat } from "fs";
import * as fs from "fs/promises";
import * as vscode from "vscode";

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
    async () => {
      var editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }
      if (!editor.document.fileName.endsWith(".dart")) {
        return; // No dart file
      }

      var selection = editor.selection;
      var text = editor.document.getText(selection);

      const keySuggestion = text
        .normalize()
        .trim()
        .replace(/["'`]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      var keyName = await vscode.window.showInputBox({
        title: "Key name",
        value: keySuggestion,
      });

      if (!keyName) {
        return;
      }

      vscode.window.showInformationMessage(`Key ${keyName}`);
      var editor = vscode.window.activeTextEditor;
      editor?.edit((builder) => {
        // Replace string
        if (keyName) {
          builder.replace(selection, `AppLocalizations.of(context).${keyName}`);
        }
        // Add import
        const importLine =
          "import 'package:flutter_gen/gen_l10n/app_localizations.dart';";
        if (!editor?.document.getText().includes(importLine)) {
          builder.insert(new vscode.Position(0, 0), importLine + "\n");
        }
      });

      const possibleArbPaths = await vscode.workspace.findFiles(
        "lib/**/intl_*.arb"
      );

      var path: vscode.Uri | undefined = undefined;
      if (possibleArbPaths.length === 0) {
        vscode.window.showErrorMessage("Failed to locate .arb file.");
        return;
      } else if (possibleArbPaths.length > 1) {
        const pickedPath = await vscode.window.showQuickPick(
          possibleArbPaths.map((res) => res.path),
          { canPickMany: false }
        );
        path = possibleArbPaths.filter((path) => path.path === pickedPath)[0];
      } else {
        path = possibleArbPaths[0];
      }
      console.log(`Using ${path.path}`);

      const arbFile = await fs.open(path.fsPath, "w+");
      try {
        const fileContents = (await arbFile.readFile()).toString().trim();
        var arb = undefined;
        if (fileContents) {
          console.log(fileContents);
          arb = JSON.parse(fileContents);
        } else {
          arb = {};
        }
        arb[keyName] = text.normalize().trim().replace(/["'`]/g, "");
        await arbFile.writeFile(JSON.stringify(arb));
      } finally {
        await arbFile.close();
      }

      vscode.window.showErrorMessage(text);
    }
  );

  context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
