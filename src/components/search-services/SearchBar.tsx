import React from "react";
import InputField from "../form/input/InputField";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Buscar serviços...",
}) => {
  return (
    <div className="w-full">
      <InputField
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;
