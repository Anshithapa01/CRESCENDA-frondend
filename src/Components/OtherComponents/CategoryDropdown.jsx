import { useState, useEffect } from "react";

export default function CategoryDropdown({
  label,
  options,
  selectedOption,
  onSelect,
  displayField,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Select option from dropdown and pass to parent component
  const selectOption = (option) => {
    onSelect(option); // Pass the full selected object
    setIsOpen(false);  // Close the dropdown
  };

  // Reset dropdown visibility when the selectedOption changes
  useEffect(() => {
    if (selectedOption) {
      setIsOpen(false); // Automatically close the dropdown if a value is pre-selected
    }
  }, [selectedOption]);

  return (
    <div className="relative w-full">
      <label className="block mb-2">{label}</label>
      <button
        type="button"
        onClick={toggleDropdown}
        className="border p-2 rounded w-full text-left flex justify-between items-center"
      >
        <span>
          {selectedOption ? selectedOption[displayField] : `Select ${label}`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 border bg-white rounded w-full max-h-40 overflow-y-auto mt-1 shadow-lg">
          {options.map((option) => (
            <div
              key={option.id || option[displayField]} // Ensure a unique key
              onClick={() => selectOption(option)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {option[displayField]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
