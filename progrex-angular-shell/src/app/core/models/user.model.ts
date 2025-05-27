// Corresponds to UserBase, UserCreate, UserUpdate, User in schemas.py

export interface UserBase {
  email: string;
  company?: string | null;
  full_name?: string | null;
}

export interface UserCreate extends UserBase {
  password_1: string; // Matching RegistrationData in AuthService for consistency, or adjust if backend differs for admin creation
  password_2: string; // Matching RegistrationData in AuthService
}

// This UserCreate is for admin creation.
// AuthService has RegistrationData for self-registration which might have slightly different fields or expectations.
// For example, admin UserCreate might not need password_2 if password_1 is set directly.
// However, using a consistent structure for password setting where possible can be simpler.
// If the backend /api/users/ (POST for admin) expects a different structure than /api/users/ (POST for self-registration, if that's what AuthService.register hits),
// then a separate interface might be needed or clarification on the backend API.
// For now, assuming it's similar to RegistrationData for password handling.

export interface UserUpdate {
  email?: string | null;
  full_name?: string | null;
  company?: string | null;
  role?: string | null;
  is_active?: boolean | null;
}

export interface User extends UserBase {
  id: number;
  is_active: boolean;
  role: string;
}
