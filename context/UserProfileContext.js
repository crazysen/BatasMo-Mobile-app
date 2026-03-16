import React, {createContext, useContext, useMemo, useState} from 'react';

const UserProfileContext = createContext(null);

const initialProfile = {
  name: 'Alex Johnson',
  email: 'alex@email.com',
  phone: '09123456789',
  address: '123 Main Street, Makati City',
  role: 'Client',
};

export const UserProfileProvider = ({children}) => {
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = updates => {
    setProfile(previous => ({
      ...previous,
      ...updates,
    }));
  };

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      setProfile,
    }),
    [profile],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }

  return context;
};