import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useData } from '../contexts/DataContext';
import { Category, Subcategory } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Users, 
  Building, 
  Package, 
  Star,
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminDashboard: React.FC = () => {
  const { institutions, donations, categories, ratings, addCategory, updateCategory, deleteCategory } = useData();
  
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categoryId: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ subcategory: Subcategory; categoryId: string } | null>(null);

  const stats = {
    totalInstitutions: institutions.length,
    verifiedInstitutions: institutions.filter(inst => inst.verified).length,
    totalDonations: donations.length,
    deliveredDonations: donations.filter(d => d.status === 'delivered').length,
    totalRatings: ratings.length,
    averageRating: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.icon.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha o nome e o ícone da categoria.',
        confirmButtonColor: '#2E7D32'
      });
      return;
    }

    const category: Category = {
      id: uuidv4(),
      name: newCategory.name,
      icon: newCategory.icon,
      subcategories: []
    };

    try {
      await addCategory(category);
      setNewCategory({ name: '', icon: '' });
      
      Swal.fire({
        icon: 'success',
        title: 'Categoria adicionada!',
        text: 'A nova categoria foi criada com sucesso.',
        confirmButtonColor: '#2E7D32',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível adicionar a categoria.',
        confirmButtonColor: '#2E7D32'
      });
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha o nome e selecione a categoria.',
        confirmButtonColor: '#2E7D32'
      });
      return;
    }

    const category = categories.find(cat => cat.id === newSubcategory.categoryId);
    if (!category) return;

    const subcategory: Subcategory = {
      id: uuidv4(),
      name: newSubcategory.name,
      categoryId: newSubcategory.categoryId
    };

    const updatedCategory = {
      ...category,
      subcategories: [...category.subcategories, subcategory]
    };

    try {
      await updateCategory(updatedCategory);
      setNewSubcategory({ name: '', categoryId: '' });
      
      Swal.fire({
        icon: 'success',
        title: 'Subcategoria adicionada!',
        text: 'A nova subcategoria foi criada com sucesso.',
        confirmButtonColor: '#2E7D32',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível adicionar a subcategoria.',
        confirmButtonColor: '#2E7D32'
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory);
      setEditingCategory(null);
      
      Swal.fire({
        icon: 'success',
        title: 'Categoria atualizada!',
        text: 'As alterações foram salvas com sucesso.',
        confirmButtonColor: '#2E7D32',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível atualizar a categoria.',
        confirmButtonColor: '#2E7D32'
      });
    }
  };

  const handleEditSubcategory = async () => {
    if (!editingSubcategory) return;

    const category = categories.find(cat => cat.id === editingSubcategory.categoryId);
    if (!category) return;

    const updatedSubcategories = category.subcategories.map(sub => 
      sub.id === editingSubcategory.subcategory.id ? editingSubcategory.subcategory : sub
    );

    const updatedCategory = {
      ...category,
      subcategories: updatedSubcategories
    };

    try {
      await updateCategory(updatedCategory);
      setEditingSubcategory(null);
      
      Swal.fire({
        icon: 'success',
        title: 'Subcategoria atualizada!',
        text: 'As alterações foram salvas com sucesso.',
        confirmButtonColor: '#2E7D32',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível atualizar a subcategoria.',
        confirmButtonColor: '#2E7D32'
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita. Todas as subcategorias também serão removidas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId);
        
        Swal.fire({
          icon: 'success',
          title: 'Categoria excluída!',
          text: 'A categoria foi removida com sucesso.',
          confirmButtonColor: '#2E7D32',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível excluir a categoria.',
          confirmButtonColor: '#2E7D32'
        });
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return;

      const updatedSubcategories = category.subcategories.filter(sub => sub.id !== subcategoryId);
      const updatedCategory = {
        ...category,
        subcategories: updatedSubcategories
      };

      try {
        await updateCategory(updatedCategory);
        
        Swal.fire({
          icon: 'success',
          title: 'Subcategoria excluída!',
          text: 'A subcategoria foi removida com sucesso.',
          confirmButtonColor: '#2E7D32',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível excluir a subcategoria.',
          confirmButtonColor: '#2E7D32'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo 🛠️
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie categorias, instituições e monitore as atividades da plataforma.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instituições</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInstitutions}</p>
                <p className="text-xs text-gray-500">{stats.verifiedInstitutions} verificadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                <p className="text-xs text-gray-500">{stats.deliveredDonations} entregues</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avaliações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRatings}</p>
                <p className="text-xs text-gray-500">Média: {stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-xs text-gray-500">
                  {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)} subcategorias
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Management */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adicionar Nova Categoria
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da categoria
                  </label>
                  <Input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Eletrônicos"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ícone (emoji)
                  </label>
                  <Input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="📱"
                    maxLength={2}
                  />
                </div>
                
                <Button
                  onClick={handleAddCategory}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Adicionar Categoria
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adicionar Subcategoria
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria pai
                  </label>
                  <select
                    value={newSubcategory.categoryId}
                    onChange={(e) => setNewSubcategory(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da subcategoria
                  </label>
                  <Input
                    type="text"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Smartphones"
                  />
                </div>
                
                <Button
                  onClick={handleAddSubcategory}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Adicionar Subcategoria
                </Button>
              </div>
            </Card>
          </div>

          {/* Categories List */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorias Existentes
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          type="text"
                          value={editingCategory.icon}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, icon: e.target.value } : null)}
                          className="w-16"
                          maxLength={2}
                        />
                        <Input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleEditCategory}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save size={14} />
                        </Button>
                        <Button
                          onClick={() => setEditingCategory(null)}
                          variant="outline"
                          size="sm"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-900">
                          {category.icon} {category.name}
                        </h4>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setEditingCategory(category)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(category.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {category.subcategories.length > 0 && (
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 mb-2">Subcategorias:</p>
                      <div className="space-y-1">
                        {category.subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between text-sm">
                            {editingSubcategory?.subcategory.id === sub.id ? (
                              <div className="flex items-center space-x-2 flex-1">
                                <span className="text-gray-700">•</span>
                                <Input
                                  type="text"
                                  value={editingSubcategory.subcategory.name}
                                  onChange={(e) => setEditingSubcategory(prev => 
                                    prev ? { 
                                      ...prev, 
                                      subcategory: { ...prev.subcategory, name: e.target.value } 
                                    } : null
                                  )}
                                  className="flex-1 h-8"
                                />
                                <Button
                                  onClick={handleEditSubcategory}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white h-6 px-2"
                                >
                                  <Save size={12} />
                                </Button>
                                <Button
                                  onClick={() => setEditingSubcategory(null)}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="text-gray-700">• {sub.name}</span>
                                <div className="flex space-x-1">
                                  <Button
                                    onClick={() => setEditingSubcategory({ subcategory: sub, categoryId: category.id })}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2"
                                  >
                                    <Edit size={12} />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50 h-6 px-2"
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Atividade Recente
          </h3>
          
          <div className="space-y-4">
            {donations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    Nova doação: {donation.category} - {donation.subcategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {donation.status} • {new Date(donation.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  donation.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  donation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {donation.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};