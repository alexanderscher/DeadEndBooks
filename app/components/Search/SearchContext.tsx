"use client";

import { Book } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";

interface SearchContextType {
  filteredData: Book[];
  setFilteredData: React.Dispatch<React.SetStateAction<Book[]>>;
}

export const SearchContext = createContext<SearchContextType>({
  filteredData: [],
  setFilteredData: () => {},
});

export const useSearchContext = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filteredData, setFilteredData] = useState<Book[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setFilteredData([]);
  }, [pathname]);

  return (
    <SearchContext.Provider value={{ filteredData, setFilteredData }}>
      {children}
    </SearchContext.Provider>
  );
};
