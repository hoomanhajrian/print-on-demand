export interface User {
  id: number;
  email: string;
  name?: string;
  role: Role;
}
export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CLIENT = 'CLIENT',
  PRINTER = 'PRINTER',
}
//home page props type
export interface HomeProps {
  users: User[]
}