import React, { createContext, useContext, useState } from 'react';

type HeaderColorContextType = {
  headerColor: string;
  setHeaderColor: (color: string) => void;
};

const HeaderColorContext = createContext<HeaderColorContextType>({
  headerColor: '#ffffff',
  setHeaderColor: () => {}
});

export const HeaderColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerColor, setHeaderColor] = useState('#ffffff');
  return (
    <HeaderColorContext.Provider value={{ headerColor, setHeaderColor }}>
      {children}
    </HeaderColorContext.Provider>
  );
};

export const useHeaderColor = () => useContext(HeaderColorContext);