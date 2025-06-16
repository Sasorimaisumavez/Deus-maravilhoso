import { User, Institution, Donation, Category, Rating } from '../types';

class FileSystemService {
  private readonly BASE_DIR = 'benigna_data';

  // Initialize directory structure
  async initializeDirectories(): Promise<void> {
    try {
      const directories = [
        'users',
        'institutions', 
        'donations',
        'categories',
        'ratings',
        'images/profiles',
        'images/institutions',
        'images/donations'
      ];

      for (const dir of directories) {
        await this.createDirectory(`${this.BASE_DIR}/${dir}`);
      }
    } catch (error) {
      console.error('Error initializing directories:', error);
    }
  }

  private async createDirectory(path: string): Promise<void> {
    // In a real file system environment, this would create actual directories
    // For now, we'll simulate with localStorage structure
    const dirKey = `${path}/.directory`;
    localStorage.setItem(dirKey, JSON.stringify({ created: new Date().toISOString() }));
  }

  // Users
  async saveUser(user: User): Promise<void> {
    const filePath = `${this.BASE_DIR}/users/${user.id}.json`;
    localStorage.setItem(filePath, JSON.stringify(user, null, 2));
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const filePath = `${this.BASE_DIR}/users/${id}.json`;
      const data = localStorage.getItem(filePath);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = [];
      const prefix = `${this.BASE_DIR}/users/`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith('.json')) {
          const data = localStorage.getItem(key);
          if (data) {
            users.push(JSON.parse(data));
          }
        }
      }
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async deleteUser(id: string): Promise<void> {
    const filePath = `${this.BASE_DIR}/users/${id}.json`;
    localStorage.removeItem(filePath);
  }

  // Institutions
  async saveInstitution(institution: Institution): Promise<void> {
    const filePath = `${this.BASE_DIR}/institutions/${institution.id}.json`;
    localStorage.setItem(filePath, JSON.stringify(institution, null, 2));
  }

  async getInstitution(id: string): Promise<Institution | null> {
    try {
      const filePath = `${this.BASE_DIR}/institutions/${id}.json`;
      const data = localStorage.getItem(filePath);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting institution:', error);
      return null;
    }
  }

  async getAllInstitutions(): Promise<Institution[]> {
    try {
      const institutions: Institution[] = [];
      const prefix = `${this.BASE_DIR}/institutions/`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith('.json')) {
          const data = localStorage.getItem(key);
          if (data) {
            institutions.push(JSON.parse(data));
          }
        }
      }
      
      return institutions;
    } catch (error) {
      console.error('Error getting all institutions:', error);
      return [];
    }
  }

  // Donations
  async saveDonation(donation: Donation): Promise<void> {
    const filePath = `${this.BASE_DIR}/donations/${donation.id}.json`;
    localStorage.setItem(filePath, JSON.stringify(donation, null, 2));
  }

  async getDonation(id: string): Promise<Donation | null> {
    try {
      const filePath = `${this.BASE_DIR}/donations/${id}.json`;
      const data = localStorage.getItem(filePath);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting donation:', error);
      return null;
    }
  }

  async getAllDonations(): Promise<Donation[]> {
    try {
      const donations: Donation[] = [];
      const prefix = `${this.BASE_DIR}/donations/`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith('.json')) {
          const data = localStorage.getItem(key);
          if (data) {
            donations.push(JSON.parse(data));
          }
        }
      }
      
      return donations;
    } catch (error) {
      console.error('Error getting all donations:', error);
      return [];
    }
  }

  // Categories
  async saveCategory(category: Category): Promise<void> {
    const filePath = `${this.BASE_DIR}/categories/${category.id}.json`;
    localStorage.setItem(filePath, JSON.stringify(category, null, 2));
  }

  async getCategory(id: string): Promise<Category | null> {
    try {
      const filePath = `${this.BASE_DIR}/categories/${id}.json`;
      const data = localStorage.getItem(filePath);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories: Category[] = [];
      const prefix = `${this.BASE_DIR}/categories/`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith('.json')) {
          const data = localStorage.getItem(key);
          if (data) {
            categories.push(JSON.parse(data));
          }
        }
      }
      
      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const filePath = `${this.BASE_DIR}/categories/${id}.json`;
    localStorage.removeItem(filePath);
  }

  // Ratings
  async saveRating(rating: Rating): Promise<void> {
    const filePath = `${this.BASE_DIR}/ratings/${rating.id}.json`;
    localStorage.setItem(filePath, JSON.stringify(rating, null, 2));
  }

  async getAllRatings(): Promise<Rating[]> {
    try {
      const ratings: Rating[] = [];
      const prefix = `${this.BASE_DIR}/ratings/`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith('.json')) {
          const data = localStorage.getItem(key);
          if (data) {
            ratings.push(JSON.parse(data));
          }
        }
      }
      
      return ratings;
    } catch (error) {
      console.error('Error getting all ratings:', error);
      return [];
    }
  }

  // Images
  async saveImage(file: File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const fileName = `${Date.now()}_${file.name}`;
          const filePath = `${this.BASE_DIR}/images/${folder}/${fileName}`;
          
          const fileData = {
            name: fileName,
            data: result,
            type: file.type,
            size: file.size,
            createdAt: new Date().toISOString()
          };
          
          localStorage.setItem(filePath, JSON.stringify(fileData));
          resolve(filePath);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  async getImage(filePath: string): Promise<string | null> {
    try {
      const fileDataJson = localStorage.getItem(filePath);
      if (!fileDataJson) return null;
      
      const fileData = JSON.parse(fileDataJson);
      return fileData.data;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }

  // Backup and restore
  async exportData(): Promise<string> {
    const data = {
      users: await this.getAllUsers(),
      institutions: await this.getAllInstitutions(),
      donations: await this.getAllDonations(),
      categories: await this.getAllCategories(),
      ratings: await this.getAllRatings(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Clear existing data
      await this.clearAllData();
      
      // Import new data
      if (data.users) {
        for (const user of data.users) {
          await this.saveUser(user);
        }
      }
      
      if (data.institutions) {
        for (const institution of data.institutions) {
          await this.saveInstitution(institution);
        }
      }
      
      if (data.donations) {
        for (const donation of data.donations) {
          await this.saveDonation(donation);
        }
      }
      
      if (data.categories) {
        for (const category of data.categories) {
          await this.saveCategory(category);
        }
      }
      
      if (data.ratings) {
        for (const rating of data.ratings) {
          await this.saveRating(rating);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  private async clearAllData(): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.BASE_DIR)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

export const fileSystemService = new FileSystemService();