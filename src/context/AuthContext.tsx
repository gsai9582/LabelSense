import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Reviewer' | 'QA Lead' | 'Admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  token?: string;
}

export const DEMO_PERSONAS: Record<UserRole, AuthUser> = {
  Reviewer: {
    id: 'USR-REV-01',
    name: 'Dr. Aris Vance',
    email: 'aris.vance@medtech-demo.internal',
    role: 'Reviewer',
    department: 'Regulatory Affairs & Vigilance',
    token: 'ls_jwt_mock_reviewer_sig_88294a',
  },
  'QA Lead': {
    id: 'USR-QA-02',
    name: 'Elena Rostova',
    email: 'elena.rostova@medtech-demo.internal',
    role: 'QA Lead',
    department: 'Quality Assurance & Release Operations',
    token: 'ls_jwt_mock_qalead_sig_99301b',
  },
  Admin: {
    id: 'USR-ADM-03',
    name: 'David Chen',
    email: 'david.chen@medtech-demo.internal',
    role: 'Admin',
    department: 'Quality Management Systems (QMS)',
    token: 'ls_jwt_mock_admin_sig_11029c',
  },
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, customName?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PERSONAS['QA Lead'],
  role: 'QA Lead',
  isAuthenticated: true,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('labelsense_auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return DEMO_PERSONAS['QA Lead'];
  });

  const role: UserRole = user ? user.role : 'QA Lead';
  const isAuthenticated = user !== null;

  useEffect(() => {
    if (user) {
      localStorage.setItem('labelsense_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('labelsense_auth_user');
    }
  }, [user]);

  const login = (newRole: UserRole, customName?: string) => {
    const base = DEMO_PERSONAS[newRole];
    setUser({
      ...base,
      name: customName || base.name,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    setUser(DEMO_PERSONAS[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
