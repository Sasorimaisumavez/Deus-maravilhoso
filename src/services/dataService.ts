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

  // Initialize sample data
  async initializeSampleData(): Promise<void> {
    const institutions = await this.getInstitutions();
    if (institutions.length === 0) {
      await this.createSampleInstitutions();
    }
  }

  private async createSampleInstitutions(): Promise<void> {
    const sampleInstitutions: Institution[] = [
      {
        id: uuidv4(),
        name: 'Casa de Apoio São Francisco',
        email: 'contato@casasaofrancisco.org',
        password: '',
        phone: '(11) 3456-7890',
        cnpj: '12.345.678/0001-90',
        type: 'institution',
        description: 'Instituição dedicada ao apoio de famílias em situação de vulnerabilidade social, oferecendo assistência alimentar, educacional e de saúde.',
        address: {
          id: uuidv4(),
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          latitude: -23.5505,
          longitude: -46.6333
        },
        workingHours: [
          { dayOfWeek: 0, isOpen: false, openTime: '', closeTime: '' },
          { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '12:00' }
        ],
        acceptedCategories: ['Roupas', 'Alimentos', 'Brinquedos'],
        rating: 4.5,
        totalRatings: 23,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'ONG Esperança',
        email: 'contato@ongesperanca.org',
        password: '',
        phone: '(11) 2345-6789',
        cnpj: '23.456.789/0001-01',
        type: 'institution',
        description: 'Organização não governamental focada na educação e desenvolvimento de crianças e adolescentes em comunidades carentes.',
        address: {
          id: uuidv4(),
          street: 'Avenida da Esperança',
          number: '456',
          neighborhood: 'Vila Nova',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '02345-678',
          latitude: -23.5489,
          longitude: -46.6388
        },
        workingHours: [
          { dayOfWeek: 0, isOpen: false, openTime: '', closeTime: '' },
          { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 6, isOpen: false, openTime: '', closeTime: '' }
        ],
        acceptedCategories: ['Livros e Material Escolar', 'Brinquedos', 'Roupas'],
        rating: 4.8,
        totalRatings: 15,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const institution of sampleInstitutions) {
      await this.saveInstitution(institution);
    }
  }
}

export const dataService = new DataService();