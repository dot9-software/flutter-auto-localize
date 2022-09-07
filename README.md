# flutter-auto-localize README

This vscode plugin was created to assist in the process of localising the flutter app Ovrnite developed by dot9. It is highly experimental and not well tested, so make sure that all files in the project are backed up on the gh remote and use at your own risk. Feel free to improve the plugin on your own if you feel the need to, since it is currently unmaintained.

Originally written by @fpwg in one afternoon to speed up his dev process.

## Features

When in a `.dart` file, select the string (with quotes) that you want to move into the `.arb` file. Then invoke the command `flutter-auto-localize.addLocalization` for which you can also add a keybind.

If there is more than one localisation file in the project, you will need to select which one you want to add the new localisation key. Then you will be prompted to provide a key, the text field should already be pre-filled with a suggestion based on the string you selected. 

After that the extension adds the localisation key along with the string to your `.arb` file, replaces the string with a reference to it and adds the relevant imports if needed.

## Requirements

Please only use in a flutter app with the standard project structure. Your localisation files should be located in `lib/**/intl_*.arb`.

## Extension Settings

-

## Known Issues

vscode might become a bit laggy when the localisation data is stored in a very large file, since it gets read, modified and written in its entirety.
