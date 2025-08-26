// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    name: string;
    isVerified: boolean;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    token: string;
    password: string;
  }
  
  export interface VerifyEmailData {
    token: string;
  }