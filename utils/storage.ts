
import * as FileSystem from 'expo-file-system';

export async function getFreeStorageMB(): Promise<number> {
  try {
    const free = await (FileSystem as any).getFreeDiskStorageAsync?.();
    if (typeof free === 'number') {
      return free / (1024 * 1024);
    }
  } catch (e) {
    console.log('getFreeStorageMB error', e);
  }
  // Fallback: unknown free disk, return a safe large number to not block usage
  return 9999;
}
