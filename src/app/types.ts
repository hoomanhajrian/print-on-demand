import { UUID } from "node:crypto";

// User roles
export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

// User interface
export interface User {
  id: UUID; // UUID
  role: Role;
  email: string;
  password_hash?: string; // Only for email/password users
  google_id?: string;
  first_name: string;
  last_name: string;
  age: number;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  active_at: Date;
  is_verified: boolean;
}

// Printer interface
export interface Printer {
  id: UUID; // UUID
  brand: string;
  model: string;
  max_dimentions: { length: number; width: number; height: number };
  user_id: UUID; // UUID, Foreign Key
  gigs: Gig[];
  orders: Order[];
  materialCharges: MaterialCharge[];
}

// Gig interface
export interface Gig {
  id: UUID; // UUID
  title: string;
  description?: string;
  duration: number;
  price: number;
  imageUrl?: string;
  category?: string;
  tags: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  printers: Printer[];
  user_id: UUID; // UUID, Foreign Key
}

// Order interface
export interface Order {
  id: UUID; // UUID
  client_id: UUID; // UUID, Foreign Key
  printer_id: UUID; // UUID, Foreign Key
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  address: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: Date;
  updated_at: Date;
  review?: Review;
}

// MaterialCharge interface
export interface MaterialCharge {
  id: UUID; // UUID
  material: string;
  chargePerHour: number;
  printer_id: UUID; // UUID, Foreign Key
}

// Review interface
export interface Review {
  id: UUID; // UUID
  order_id: UUID; // UUID, Foreign Key
  from_id: UUID; // UUID, Foreign Key
  to_id: UUID; // UUID, Foreign Key
  rating: number;
  comment?: string;
  created_at: Date;
}

// Example of a combined type for data fetching (if needed)
export interface OrderWithDetails extends Order {
  printer: User; // Include the printer's user details
}

export interface ReviewWithClient extends Review {
  client: User;
}

// Home page props type
export interface HomeProps {
  users: User[];
}

// API response type
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}