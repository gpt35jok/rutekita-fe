export type UserRole = 'admin' | 'petugas';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface RouteResult {
  distance: number; // in km
  duration: number; // in minutes
  executionTime: number; // in ms
  path: [number, number][];
}

export interface Depot {
  name: string;
  latitude: number;
  longitude: number;
}
