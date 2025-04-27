import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
  placeholderTextColor?: string;
  outerClassName?: string;
}

export default function SearchInput({
  placeholder = "Pretraži",
  value,
  onChange,
  className = "",
  outerClassName = "",
  iconColor = "text-white",
  bgColor = "bg-[#966498]/10",
  borderColor = "border-white/30",
  placeholderTextColor = "placeholder:text-white/30",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const searchValue = value !== undefined ? value : internalValue;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const clearSearch = () => {
    if (onChange) {
      onChange("");
    } else {
      setInternalValue("");
    }
  };

  return (
    <div className={`relative ${outerClassName}`}>
      <Search
        className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${iconColor}`}
      />
      <Input
        placeholder={placeholder}
        className={`w-xs rounded-full ${borderColor} ${bgColor} pl-10 ${iconColor} ${placeholderTextColor} ${className}`}
        value={searchValue}
        onChange={handleChange}
      />
      <X
        className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer ${iconColor} transition-opacity duration-300 ease-in-out ${
          searchValue
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={clearSearch}
      />
    </div>
  );
}
