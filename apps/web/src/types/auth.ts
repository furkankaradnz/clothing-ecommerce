export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
