import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Institution, Donation, Category, Rating } from '../types';
import { dataService } from '../services/dataService';

interface DataContextType {
  institutions: Institution[];
  donations: Donation[];
  categories: Category[];
  ratings: Rating[];
  refreshData: () => Promise<void>;
  addInstitution: (institution: Institution) => Promise<void>;
  updateInstitution: (institution: Institution) => Promise<void>;
  addDonation: (donation: Donation) => Promise<void>;
  updateDonation: (donation: Donation) => Promise<void>;
  addRating: (rating: Rating) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const [institutionsData, donationsData, categoriesData, ratingsData] = await Promise.all([
        dataService.getInstitutions(),
        dataService.getDonations(),
        dataService.getCategories(),
        dataService.getRatings()
      ]);

      setInstitutions(institutionsData);
      setDonations(donationsData);
      setCategories(categoriesData);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const addInstitution = async (institution: Institution) => {
    await dataService.saveInstitution(institution);
    setInstitutions(prev => [...prev, institution]);
  };

  const updateInstitution = async (institution: Institution) => {
    await dataService.saveInstitution(institution);
    setInstitutions(prev => prev.map(inst => inst.id === institution.id ? institution : inst));
  };

  const addDonation = async (donation: Donation) => {
    await dataService.saveDonation(donation);
    setDonations(prev => [...prev, donation]);
  };

  const updateDonation = async (donation: Donation) => {
    await dataService.saveDonation(donation);
    setDonations(prev => prev.map(don => don.id === donation.id ? donation : don));
  };

  const addRating = async (rating: Rating) => {
    await dataService.saveRating(rating);
    setRatings(prev => [...prev, rating]);
    
    // Update institution rating
    const institution = institutions.find(inst => inst.id === rating.institutionId);
    if (institution) {
      const institutionRatings = [...ratings, rating].filter(r => r.institutionId === rating.institutionId);
      const avgRating = institutionRatings.reduce((sum, r) => sum + r.rating, 0) / institutionRatings.length;
      
      const updatedInstitution = {
        ...institution,
        rating: avgRating,
        totalRatings: institutionRatings.length
      };
      
      await updateInstitution(updatedInstitution);
    }
  };

  const addCategory = async (category: Category) => {
    await dataService.saveCategory(category);
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = async (category: Category) => {
    await dataService.saveCategory(category);
    setCategories(prev => prev.map(cat => cat.id === category.id ? category : cat));
  };

  const deleteCategory = async (categoryId: string) => {
    await dataService.deleteCategory(categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const value = {
    institutions,
    donations,
    categories,
    ratings,
    refreshData,
    addInstitution,
    updateInstitution,
    addDonation,
    updateDonation,
    addRating,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};