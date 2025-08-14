// src/components/SearchBar/index.tsx

import React from 'react';
import { SearchContainer } from "./styles";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Opcional: onSearch (para submissão de busca) ou onClear (para limpar)
}

const SearchBar = ({ placeholder = "Search", value, onChange }: SearchBarProps) => {
  return (
    <SearchContainer>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </SearchContainer>
  );
};

export default SearchBar;
