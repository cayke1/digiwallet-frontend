export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}
