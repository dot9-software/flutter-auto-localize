import * as vscode from "vscode";
import * as fs from "fs/promises";

import { createKeySuggestion, unquoteString } from "./util";

export const handleCommand = async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }
  if (!editor.document.fileName.endsWith(".dart")) {
    return; // No dart file
  }

  const selection = editor.selection;
  const selectionText = editor.document.getText(selection);
  const unquotedSelection = unquoteString(selectionText);
  const keyName = await promptForKeyName(unquotedSelection);

  if (!keyName || keyName.length === 0) {
    vscode.window.showErrorMessage("No key name");
    return;
  }

  try {
    const path = await findArbFilePath();
    await makeArbFileEdit(keyName, unquotedSelection, path);
    await makeDartFileEdit(keyName, selection);
  } catch (error: any) {
    vscode.window.showErrorMessage(error.toString());
    return;
  }
};

function makeDartFileEdit(keyName: string, selection: vscode.Selection) {
  const editor = vscode.window.activeTextEditor;
  return editor?.edit((builder) => {
    // Replace string in editor
    builder.replace(selection, stringReplacement(keyName));

    // Add import if needed
    if (!editor?.document.getText().includes(importLine())) {
      builder.insert(new vscode.Position(0, 0), importLine() + "\n");
    }
  });
}

async function makeArbFileEdit(
  keyName: string,
  unquotedSelection: string,
  path: vscode.Uri
) {
  // Read file
  const fileContents = await fs.readFile(path.fsPath);
  console.log(`File contents: ${fileContents.toJSON()} ${fileContents.length}`);

  // Read into object
  var arb = undefined;
  if (fileContents) {
    console.log(fileContents);
    arb = JSON.parse(fileContents.toString());
  } else {
    arb = {};
  }
  console.log(`Parsed arb ${arb}`);

  // Check if key exists
  if (arb[keyName] !== undefined) {
    throw Error(`Key ${keyName} already in use`);
  }

  // Write string and write file
  arb[keyName] = unquotedSelection.normalize().trim();
  await fs.writeFile(path.fsPath, JSON.stringify(arb), { flag: "w" });
}

async function promptForKeyName(selectedText: string) {
  const keyName = await vscode.window.showInputBox({
    title: "Key name",
    value: createKeySuggestion(selectedText),
  });
  return keyName;
}

async function findArbFilePath() {
  const possibleArbPaths = await vscode.workspace.findFiles(
    "lib/**/intl_*.arb"
  );

  var path: vscode.Uri | undefined = undefined;
  if (possibleArbPaths.length === 0) {
    throw Error("Failed to locate .arb file.");
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

  return path;
}

function stringReplacement(keyName: string) {
  return "AppLocalizations.of(context).{}".replace(/{}/g, keyName);
}

function importLine() {
  return "import 'package:flutter_gen/gen_l10n/app_localizations.dart';";
}
