// contexts/LocationContext.tsx
import { createContext, useContext, useState } from 'react';

const LocationContext = createContext<{
  locationId: number;
  setLocationId: (id: number) => void;
}>({ locationId: 1, setLocationId: () => {} });

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locationId, setLocationId] = useState(1);
  return (
    <LocationContext.Provider value={{ locationId, setLocationId }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);