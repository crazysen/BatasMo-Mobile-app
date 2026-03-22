import React, {createContext, useContext, useMemo, useState, useCallback} from 'react';

const UserProfileContext = createContext(null);

const initialProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  age: '',
  guardian_name: '',
  guardian_contact: '',
  role: 'Client',
};

export const UserProfileProvider = ({children}) => {
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = useCallback((updates) => {
    setProfile(previous => ({
      ...previous,
      ...updates,
    }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      setProfile,
    }),
    [profile, updateProfile],
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