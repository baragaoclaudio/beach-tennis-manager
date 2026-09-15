import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

function findWorkspaceRoot(startDir: string): string | undefined {
  let current = startDir;

  while (true) {
    const packageJsonPath = resolve(current, 'package.json');

    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
          workspaces?: unknown;
        };

        if (packageJson.workspaces) {
          return current;
        }
      } catch {
        // Ignore unreadable package.json files while walking up.
      }
    }

    const parent = dirname(current);

    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

const workspaceRoot = findWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));
const envFile = workspaceRoot ? resolve(workspaceRoot, '.env') : undefined;

if (envFile && existsSync(envFile)) {
  config({ path: envFile });
}
