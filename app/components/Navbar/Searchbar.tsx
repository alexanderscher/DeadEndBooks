"use client";
import { useSearchContext } from "@/app/components/Search/SearchContext";
import React, { useState } from "react";

interface Props {
  data: any;
  color?: string;
  height?: string;
}

function SearchBar({ data, color = "slate-400", height = "h-8" }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const { filteredData, setFilteredData } = useSearchContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const newFilteredData = data.filter(
      (item: any) =>
        (item.title &&
          item.title.toLowerCase().includes(newSearchTerm.toLowerCase())) ||
        (item.author &&
          item.author.toLowerCase().includes(newSearchTerm.toLowerCase()))
    );

    setFilteredData(newFilteredData); // Call the callback with the new filtered data
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        className={`border-${color} border-[2px] w-full mt-6 ${height} px-2 focus:outline-none`}
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
