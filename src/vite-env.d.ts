/// <reference types="vite/client" />
/// <reference types="@tauri-apps/api" />

declare module '@tauri-apps/api/v2/path' {
  export function homeDir(): Promise<string>;
}

declare module '@tauri-apps/api/v2/fs' {
  export interface FileEntry {
    path: string;
    name?: string;
    children?: FileEntry[];
    metadata: () => Promise<{
      size?: number;
      modifiedAt?: Date;
    }>;
  }
  export function readDir(path: string, options?: { recursive?: boolean }): Promise<FileEntry[]>;
}

declare module '@tauri-apps/api/v2/dialog' {
  export function open(options: {
    directory?: boolean;
    multiple?: boolean;
    defaultPath?: string;
  }): Promise<string | string[] | null>;
} 