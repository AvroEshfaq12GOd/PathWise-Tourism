import React, { useState, createContext, useContext } from 'react';
type Role = 'tourist' | 'admin' | null;
interface AuthContextType {
  role: Role;
  signIn: (role: Role) => void;
  signOut: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [role, setRole] = useState<Role>(() => {
    return localStorage.getItem('pathwise_role') as Role || null;
  });
  const signIn = (newRole: Role) => {
    setRole(newRole);
    if (newRole) localStorage.setItem('pathwise_role', newRole);
  };
  const signOut = () => {
    setRole(null);
    localStorage.removeItem('pathwise_role');
  };
  return (
    <AuthContext.Provider
      value={{
        role,
        signIn,
        signOut
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
  throw new Error('useAuth must be used within AuthProvider');
  return context;
}