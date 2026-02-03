import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User } from '@/types';
import { Search, Plus, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'admin',
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('rutekita_token');
        const res = await fetch(`${API_URL}/admin/users`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json', 
            'ngrok-skip-browser-warning': 'true', 
            'Authorization': 'Bearer '+token 
          },
        }); // ganti sesuai endpoint API
        if (!res.ok) throw new Error('Failed to fetch users');
        const json = await res.json();
        setUsers(json.data); // ambil data dari response
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data user',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    setActiveMenu(null);
    toast({
      title: 'User deleted',
      description: 'The user has been removed successfully.',
    });
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('rutekita_token');
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', 
          'Authorization': 'Bearer '+token 
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Failed to add user');
      const json = await res.json();

      // tambahkan ke list
      setUsers([...users, json.data]);
      setIsModalOpen(false);
      setNewUser({ username: '', password: '', role: 'admin' });
      toast({
        title: 'User added',
        description: 'User berhasil ditambahkan.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan user.',
      });
    }
  };


  const toggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
    setActiveMenu(null);
    toast({
      title: 'Status updated',
      description: 'User status has been changed.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">
              Manage system users and their roles
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="panel-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select className="input-field w-auto">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="petugas">Delivery Officer</option>
              </select>
              <select className="input-field w-auto">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="panel-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No users found matching your criteria.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{user.username}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-warning'}`}>
                          {user.role === 'admin' ? 'Administrator' : 'Delivery Officer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {activeMenu === user.id && (
                            <div className="absolute right-0 top-full mt-1 z-10 w-40 rounded-lg border border-border bg-card shadow-lg py-1">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

     {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add User</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="input-field"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="input-field"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="input-field"
              >
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
              </select>
              <button
                onClick={handleAddUser}
                className="btn-primary mt-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}