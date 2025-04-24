// types/model.ts

// Interface for the user
export interface User {
    id: string;
    email: string;
    role: "admin" | "user"; // Adjust the roles as needed
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }
  
  // Interface for attendance record
  export interface AttendanceRecord {
    id: string; // Firestore document ID
    uid: string; // User ID (refers to the User in Firestore)
    email: string; // User's email
    status: "present" | "absent" | "late"; // Attendance status
    timestamp: string; // Date string in YYYY-MM-DD format
    date: Date; // Actual Date object for easier date manipulation
  }
  
  // Interface for login credentials
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // Interface for user registration data
  export interface UserRegistrationData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }
  
  // Interface for Firebase response with user details
  export interface FirebaseUser {
    uid: string;
    email: string;
    role: "admin" | "user"; // Add more roles as needed
  }
  
  // Interface for the authentication context
  export interface AuthContextType {
    user: User | null;
    role: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  // Interface for role-based access
  export interface RoleBasedAccess {
    isAdmin: boolean;
    isUser: boolean;
  }
  