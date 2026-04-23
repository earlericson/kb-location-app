"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// 1. Define what information is available through this context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 2. Initialize the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a "listener" that runs whenever 
    // the user's login status changes (Login, Logout, or Session Refresh)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Sync the cookie if the user is authenticated
      // This helps the middleware if the user refreshes the page
      if (currentUser) {
        document.cookie = "session=true; path=/; max-age=3600; SameSite=Lax";
      }
    });

    // Cleanup the listener when the component is destroyed
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // 1. Sign out from Firebase Auth
      await signOut(auth);
      
      // 2. Clear the session cookie for the Middleware
      // We expire it in the past to delete it immediately
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {/* We only render the children once 'loading' is false. 
          This prevents the app from showing "Logged Out" content 
          for a split second while Firebase is still checking the session.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook to use the Auth context in any component
export const useAuth = () => useContext(AuthContext);