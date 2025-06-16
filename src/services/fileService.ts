import { fileSystemService } from './fileSystemService';

class FileService {
  async saveImage(file: File, folder: string): Promise<string> {
    return await fileSystemService.saveImage(file, folder);
  }

  async getImage(filePath: string): Promise<string | null> {
    return await fileSystemService.getImage(filePath);
  }

  deleteImage(filePath: string): boolean {
    try {
      localStorage.removeItem(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // List files in folder
  listFiles(folder: string): string[] {
    const prefix = `benigna_data/images/${folder}/`;
    const files: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && !key.endsWith('/.directory')) {
        files.push(key);
      }
    }
    
    return files;
  }

  // Initialize folder structure
  async initializeFolders(): Promise<void> {
    await fileSystemService.initializeDirectories();
  }
}

export const fileService = new FileService();