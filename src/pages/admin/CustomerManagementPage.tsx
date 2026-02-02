import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCustomers } from '@/data/mockData';
import { Customer } from '@/types';
import { Search, Plus, MoreVertical, Edit, Trash2, MapPin, Phone, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    setActiveMenu(null);
    toast({
      title: 'Customer deleted',
      description: 'The customer has been removed successfully.',
    });
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        latitude: String(customer.latitude),
        longitude: String(customer.longitude),
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        latitude: '',
        longitude: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
              }
            : c
        )
      );
      toast({
        title: 'Customer updated',
        description: 'Customer information has been updated.',
      });
    } else {
      const newCustomer: Customer = {
        id: String(customers.length + 1),
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
      toast({
        title: 'Customer added',
        description: 'New customer has been added successfully.',
      });
    }
    setShowModal(false);
    setActiveMenu(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage delivery locations and customer data
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-primary">
            <Plus className="h-5 w-5" />
            Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="panel-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="panel-card group hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {activeMenu === customer.id && (
                    <div className="absolute right-0 top-full mt-1 z-10 w-32 rounded-lg border border-border bg-card shadow-lg py-1">
                      <button
                        onClick={() => {
                          openModal(customer);
                          setActiveMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{customer.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {customer.address}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Phone className="h-4 w-4" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <MapPin className="h-3 w-3" />
                {customer.latitude.toFixed(4)}, {customer.longitude.toFixed(4)}
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="panel-card py-12 text-center text-muted-foreground">
            No customers found matching your criteria.
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingCustomer ? 'Update' : 'Add Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
