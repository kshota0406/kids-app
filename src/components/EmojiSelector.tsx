import React from 'react';

interface EmojiOption {
  value: string;
  label: string;
  emoji: string;
}

interface EmojiSelectorProps {
  options: EmojiOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  options,
  selectedValue,
  onChange
}) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-72 overflow-y-auto p-2 border border-gray-200 rounded-lg">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${
            selectedValue === option.value 
              ? 'bg-blue-100 border-blue-500 shadow-md' 
              : 'hover:bg-gray-50'
          }`}
          title={option.label}
        >
          <span className="text-3xl">{option.emoji}</span>
        </div>
      ))}
    </div>
  );
};

export default EmojiSelector; 