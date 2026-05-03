import { createContext, useContext, useState } from "react";

const StoreContext = createContext<any>(null);

export const StoreProvider = ({ children }: any) => {
  const [currentStore, setCurrentStore] = useState("Aurrerá");

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
