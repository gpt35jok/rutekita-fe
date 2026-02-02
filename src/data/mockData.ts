import { User, Customer, Depot } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    email: 'ahmad@rutekita.com',
    role: 'admin',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi@rutekita.com',
    role: 'delivery',
    createdAt: '2024-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Citra Dewi',
    email: 'citra@rutekita.com',
    role: 'delivery',
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Dedi Prasetyo',
    email: 'dedi@rutekita.com',
    role: 'admin',
    createdAt: '2024-03-15',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Eka Putri',
    email: 'eka@rutekita.com',
    role: 'delivery',
    createdAt: '2024-04-01',
    status: 'active',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'PT Maju Jaya',
    address: 'Jl. Sudirman No. 45, Jakarta',
    phone: '+62 21 5550101',
    latitude: -6.2088,
    longitude: 106.8456,
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'CV Berkah Abadi',
    address: 'Jl. Gatot Subroto No. 78, Jakarta',
    phone: '+62 21 5550102',
    latitude: -6.2350,
    longitude: 106.8220,
    createdAt: '2024-02-05',
  },
  {
    id: '3',
    name: 'Toko Sejahtera',
    address: 'Jl. Thamrin No. 12, Jakarta',
    phone: '+62 21 5550103',
    latitude: -6.1944,
    longitude: 106.8229,
    createdAt: '2024-02-18',
  },
  {
    id: '4',
    name: 'UD Makmur Sentosa',
    address: 'Jl. Kuningan No. 33, Jakarta',
    phone: '+62 21 5550104',
    latitude: -6.2297,
    longitude: 106.8372,
    createdAt: '2024-03-02',
  },
  {
    id: '5',
    name: 'PT Gemilang Raya',
    address: 'Jl. Rasuna Said No. 55, Jakarta',
    phone: '+62 21 5550105',
    latitude: -6.2176,
    longitude: 106.8317,
    createdAt: '2024-03-20',
  },
  {
    id: '6',
    name: 'CV Prima Karya',
    address: 'Jl. Menteng No. 88, Jakarta',
    phone: '+62 21 5550106',
    latitude: -6.1951,
    longitude: 106.8429,
    createdAt: '2024-04-05',
  },
];

export const defaultDepot: Depot = {
  name: 'RuteKita Depot',
  latitude: -6.2000,
  longitude: 106.8166,
};

export const mockRouteStats = {
  totalRoutes: 156,
  avgDistance: 12.5,
  avgDuration: 28,
  successRate: 98.5,
};
