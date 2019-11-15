import { ExtensionContext, commands, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient";

let client: LanguageClient | undefined;

const startServer = () => {
  // Spin up a new server
  const command = workspace.getConfiguration("amulet").get("amuletLspExecutable", "amulet-lsp");
  const serverOptions: ServerOptions = { command };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "amulet" }],
    synchronize: {
      // Also notify the server about changes to .ml files.
      fileEvents: workspace.createFileSystemWatcher("**/.ml"),
    },
  };

  client = new LanguageClient("amulet", "Amulet Language Server", serverOptions, clientOptions);
  client.start();
};

const stopServer = () => client ? client.stop() : Promise.resolve();

export const activate = (context: ExtensionContext) => {
  startServer();

  context.subscriptions.push(commands.registerCommand("amulet.restartServer", async () => {
    await stopServer();
    startServer();
  }));
};

export const deactivate = (): Thenable<void> | undefined => {
  if (!client) return undefined;
  return client.stop();
};
