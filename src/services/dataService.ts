import { v4 as uuidv4 } from 'uuid';
import { Institution, Donation, Category, Rating, Subcategory } from '../types';
import { fileSystemService } from './fileSystemService';

class DataService {
  // Institutions
  async getInstitutions(): Promise<Institution[]> {
    return await fileSystemService.getAllInstitutions();
  }

  async saveInstitution(institution: Institution): Promise<void> {
    await fileSystemService.saveInstitution(institution);
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    return await fileSystemService.getInstitution(id);
  }

  // Donations
  async getDonations(): Promise<Donation[]> {
    return await fileSystemService.getAllDonations();
  }

  async saveDonation(donation: Donation): Promise<void> {
    await fileSystemService.saveDonation(donation);
  }

  async getDonationById(id: string): Promise<Donation | null> {
    return await fileSystemService.getDonation(id);
  }

  async getDonationsByDonor(donorId: string): Promise<Donation[]> {
    const donations = await this.getDonations();
    return donations.filter(don => don.donorId === donorId);
  }

  async getDonationsByInstitution(institutionId: string): Promise<Donation[]> {
    const donations = await this.getDonations();
    return donations.filter(don => don.institutionId === institutionId);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categories = await fileSystemService.getAllCategories();
    return categories.length > 0 ? categories : await this.getDefaultCategories();
  }

  async saveCategory(category: Category): Promise<void> {
    await fileSystemService.saveCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await fileSystemService.deleteCategory(id);
  }

  private async getDefaultCategories(): Promise<Category[]> {
    const defaultCategories: Category[] = [
      {
        id: uuidv4(),
        name: 'Roupas',
        icon: '👕',
        subcategories: [
          { id: uuidv4(), name: 'Roupas Infantis', categoryId: '' },
          { id: uuidv4(), name: 'Roupas Adultas', categoryId: '' },
          { id: uuidv4(), name: 'Roupas de Frio', categoryId: '' },
          { id: uuidv4(), name: 'Calçados', categoryId: '' }
        ]
      },
      {
        id: uuidv4(),
        name: 'Alimentos',
        icon: '🍞',
        subcategories: [
          { id: uuidv4(), name: 'Alimentos Não Perecíveis', categoryId: '' },
          { id: uuidv4(), name: 'Cestas Básicas', categoryId: '' },
          { id: uuidv4(), name: 'Produtos de Higiene', categoryId: '' }
        ]
      },
      {
        id: uuidv4(),
        name: 'Móveis',
        icon: '🪑',
        subcategories: [
          { id: uuidv4(), name: 'Móveis Pequenos', categoryId: '' },
          { id: uuidv4(), name: 'Móveis Grandes', categoryId: '' },
          { id: uuidv4(), name: 'Eletrodomésticos', categoryId: '' }
        ]
      },
      {
        id: uuidv4(),
        name: 'Livros e Material Escolar',
        icon: '📚',
        subcategories: [
          { id: uuidv4(), name: 'Livros Didáticos', categoryId: '' },
          { id: uuidv4(), name: 'Material Escolar', categoryId: '' },
          { id: uuidv4(), name: 'Brinquedos Educativos', categoryId: '' }
        ]
      },
      {
        id: uuidv4(),
        name: 'Brinquedos',
        icon: '🧸',
        subcategories: [
          { id: uuidv4(), name: 'Brinquedos Infantis', categoryId: '' },
          { id: uuidv4(), name: 'Jogos', categoryId: '' },
          { id: uuidv4(), name: 'Brinquedos Educativos', categoryId: '' }
        ]
      }
    ];

    // Set category IDs for subcategories
    defaultCategories.forEach(category => {
      category.subcategories.forEach(sub => {
        sub.categoryId = category.id;
      });
    });

    // Save default categories
    for (const category of defaultCategories) {
      await this.saveCategory(category);
    }

    return defaultCategories;
  }

  // Ratings
  async getRatings(): Promise<Rating[]> {
    return await fileSystemService.getAllRatings();
  }

  async saveRating(rating: Rating): Promise<void> {
    await fileSystemService.saveRating(rating);
  }

  async getRatingsByInstitution(institutionId: string): Promise<Rating[]> {
    const ratings = await this.getRatings();
    return ratings.filter(rating => rating.institutionId === institutionId);
  }

  // Initialize sample data - removed sample institutions
  async initializeSampleData(): Promise<void> {
    // Only initialize categories if they don't exist
    const categories = await fileSystemService.getAllCategories();
    if (categories.length === 0) {
      await this.getDefaultCategories();
    }
  }
}

export const dataService = new DataService();