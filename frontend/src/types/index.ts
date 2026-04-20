export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Submission {
  _id: string;
  user: string | User;
  userName: string;
  workDone: string;
  status: 'complete' | 'incomplete';
  submittedAt: string;
  updatedAt: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface SubmissionState {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface CreateSubmissionData {
  workDone: string;
  status: 'complete' | 'incomplete';
}

export interface UpdateSubmissionData {
  id: string;
  workDone?: string;
  status?: 'complete' | 'incomplete';
  userName?: string;
}
