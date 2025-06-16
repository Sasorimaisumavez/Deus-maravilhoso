import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Institution, Donation } from '../types';
import { 
  Package, 
  Calendar, 
  CheckCircle, 
  Clock,
  Star,
  MapPin,
  Settings,
  Users,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Swal from 'sweetalert2';

export const InstitutionDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { donations, institutions, updateDonation, updateInstitution, categories } = useData();
  
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [institutionDonations, setInstitutionDonations] = useState<Donation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    acceptedCategories: [] as string[]
  });

  useEffect(() => {
    if (user && user.type === 'institution') {
      // Find institution by user ID
      const inst = institutions.find(inst => inst.id === user.id);
      if (inst) {
        setInstitution(inst);
        setEditForm({
          name: inst.name,
          email: inst.email,
          phone: inst.phone,
          description: inst.description,
          acceptedCategories: inst.acceptedCategories
        });
        
        const filtered = donations.filter(donation => donation.institutionId === inst.id);
        setInstitutionDonations(filtered);
      }
    }
  }, [user, donations, institutions]);

  const handleConfirmDelivery = (donationId: string) => {
    const donation = institutionDonations.find(d => d.id === donationId);
    if (donation) {
      const updatedDonation = {
        ...donation,
        status: 'delivered' as const,
        deliveredDate: new Date(),
        updatedAt: new Date()
      };
      updateDonation(updatedDonation);
    }
  };

  const handleSaveChanges = async () => {
    if (!institution || !user) return;

    try {
      // Update user data
      const updatedUser = {
        ...user,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      };

      // Update institution data
      const updatedInstitution = {
        ...institution,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        description: editForm.description,
        acceptedCategories: editForm.acceptedCategories,
        updatedAt: new Date()
      };

      await updateUser(updatedUser);
      await updateInstitution(updatedInstitution);
      
      setInstitution(updatedInstitution);
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Informações atualizadas!',
        text: 'Suas informações foram salvas com sucesso.',
        confirmButtonColor: '#2E7D32',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível salvar as alterações.',
        confirmButtonColor: '#2E7D32'
      });
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setEditForm(prev => ({
      ...prev,
      acceptedCategories: prev.acceptedCategories.includes(categoryName)
        ? prev.acceptedCategories.filter(cat => cat !== categoryName)
        : [...prev.acceptedCategories, categoryName]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="text-blue-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: institutionDonations.length,
    scheduled: institutionDonations.filter(d => d.status === 'scheduled').length,
    delivered: institutionDonations.filter(d => d.status === 'delivered').length,
    rating: institution?.rating || 0
  };

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Instituição não encontrada
            </h1>
            <p className="text-gray-600 mt-2">
              Verifique se você está logado como uma instituição.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {institution.name} 🏢
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie as doações recebidas e mantenha seu perfil atualizado.
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isEditing ? <X size={16} /> : <Edit size={16} />}
              <span>{isEditing ? 'Cancelar' : 'Editar perfil'}</span>
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar informações
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da instituição
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorias aceitas
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editForm.acceptedCategories.includes(category.name)}
                        onChange={() => handleCategoryToggle(category.name)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{category.icon} {category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="mr-2" size={16} />
                Salvar alterações
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total recebido</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agendadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avaliação</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Categories */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categorias aceitas atualmente
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {institution.acceptedCategories.map((categoryName) => {
              const category = categories.find(cat => cat.name === categoryName);
              return (
                <div
                  key={categoryName}
                  className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-center font-medium"
                >
                  {category?.icon} {categoryName}
                </div>
              );
            })}
          </div>
          {institution.acceptedCategories.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhuma categoria selecionada. Clique em "Editar perfil" para adicionar.
            </p>
          )}
        </Card>

        {/* Donations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Doações recebidas</h2>
          </div>

          {institutionDonations.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma doação ainda
              </h3>
              <p className="text-gray-600">
                Quando alguém agendar uma entrega para sua instituição, ela aparecerá aqui.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {institutionDonations.map((donation) => (
                <Card key={donation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(donation.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(donation.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {donation.category} - {donation.subcategory}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {donation.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>
                          <strong>Quantidade:</strong> {donation.quantity} {donation.quantity === 1 ? 'item' : 'itens'}
                        </span>
                        <span>
                          <strong>Condição:</strong> {
                            donation.condition === 'new' ? 'Novo' :
                            donation.condition === 'used_good' ? 'Usado (bom estado)' :
                            'Usado (estado regular)'
                          }
                        </span>
                      </div>

                      {donation.scheduledDate && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <Calendar className="inline mr-1" size={14} />
                            <strong>Entrega agendada para:</strong>{' '}
                            {format(new Date(donation.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      )}

                      {donation.deliveredDate && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            <CheckCircle className="inline mr-1" size={14} />
                            <strong>Entregue em:</strong>{' '}
                            {format(new Date(donation.deliveredDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                    {donation.status === 'scheduled' && (
                      <Button
                        onClick={() => handleConfirmDelivery(donation.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="mr-1" size={14} />
                        Confirmar entrega
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};