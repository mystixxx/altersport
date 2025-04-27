"use client";

import { useState } from "react";

interface QuizProps {
  question: string;
  questionDescription?: string;
  options: string[];
  onSelect?: (value: string) => void;
  onMultiSelect?: (values: string[]) => void;
  allowMultiple?: boolean;
  selectedValues?: string[];
  useGrid?: boolean;
}

export default function Quiz({
  question,
  questionDescription,
  options,
  onSelect,
  onMultiSelect,
  allowMultiple = false,
  selectedValues = [],
  useGrid = false,
}: QuizProps) {
  const [value, setValue] = useState<string>("");
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(selectedValues);

  const handleValueChange = (newValue: string) => {
    // For single selection
    if (!allowMultiple) {
      // Allow deselection by clicking on the same option again
      if (value === newValue) {
        setValue("");
        if (onSelect) {
          onSelect("");
        }
      } else {
        setValue(newValue);
        if (onSelect) {
          onSelect(newValue);
        }
      }
    }
  };

  // Handle click on the option container to support deselection
  const handleOptionClick = (option: string) => {
    if (allowMultiple) {
      const optionValue = option.toLowerCase();
      let newSelectedOptions;

      if (selectedOptions.includes(optionValue)) {
        // Remove the option if already selected
        newSelectedOptions = selectedOptions.filter(
          (item) => item !== optionValue,
        );
      } else {
        // Add the option if not already selected
        newSelectedOptions = [...selectedOptions, optionValue];
      }

      setSelectedOptions(newSelectedOptions);
      if (onMultiSelect) {
        onMultiSelect(newSelectedOptions);
      }
    } else {
      handleValueChange(option.toLowerCase());
    }
  };

  // Render single option
  const renderOption = (option: string, index: number) => {
    const optionValue = option.toLowerCase();
    const isSelected = allowMultiple
      ? selectedOptions.includes(optionValue)
      : value === optionValue;

    return (
      <div
        key={index}
        onClick={() => handleOptionClick(option)}
        className={`flex cursor-pointer items-center rounded-full border-2 px-4 py-2 transition-all duration-200 ${
          isSelected
            ? "border-selected bg-[#5D3977]/80"
            : "border-white/20 bg-[#45275A]/60 hover:bg-[#45275A]/80"
        }`}
      >
        <div
          className={`flex size-4 items-center justify-center rounded-full border ${
            isSelected ? "border-selected" : "border-white/50"
          }`}
        >
          {isSelected && <div className="bg-selected h-3 w-3 rounded-full" />}
        </div>
        <span className="ml-3 flex-grow text-left text-white">{option}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-4xl font-bold text-white">{question}</h2>
        {questionDescription && (
          <p className="text-base font-medium text-white/80">
            {questionDescription}
          </p>
        )}
      </div>

      {useGrid ? (
        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option, index) => renderOption(option, index))}
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {options.map((option, index) => renderOption(option, index))}
        </div>
      )}
    </div>
  );
}
