import React, {createContext, useContext, useMemo, useState} from 'react';

const UserProfileContext = createContext(null);

const initialProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
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