import { UUID } from "node:crypto";

// types.ts

export interface User {
  id: UUID; // UUID
  user_type: Role;
  email: string;
  password_hash?: string; // Only for email/password users
  google_id?: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
}
//user roles 
enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CLIENT = 'CLIENT',
  PRINTER = 'PRINTER',
}

export interface PrinterProfile extends User { // PrinterProfile extends User
  bio?: string;
  location: string;
  technologies: string[];
  materials: string[];
  hourly_rate?: number;
  portfolio?: string[];
}

export interface PrintRequest {
  id: string; // UUID
  client_id: string; // UUID, Foreign Key
  model_url: string; // URL to Google Cloud Storage
  material: string;
  quantity: number;
  size: string;
  details?: string;
  created_at: Date;
}

export interface Order {
  id: string; // UUID
  request_id: string; // UUID, Foreign Key
  printer_id: string; // UUID, Foreign Key
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  tags: string[];
  availableMaterials: string[];
  availableSizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string; // UUID
  order_id: string; // UUID, Foreign Key
  client_id: string; // UUID, Foreign Key
  rating: number;
  comment?: string;
  created_at: Date;
}


// Example of a combined type for data fetching (if needed)

export interface PrintRequestWithUser extends PrintRequest {
  client: User; // Include the client's user details
}

export interface OrderWithDetails extends Order {
  request: PrintRequest;
  printer: User; // Include the printer's user details
}

export interface ReviewWithClient extends Review {
  client: User;
}

//home page props type
export interface HomeProps {
  users: User[]
}