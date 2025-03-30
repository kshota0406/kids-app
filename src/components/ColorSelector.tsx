import React from 'react';

interface ColorOption {
  value: string;
  label: string;
}

interface ColorSelectorProps {
  options: ColorOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  options,
  selectedValue,
  onChange
}) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
      {options.map((color) => (
        <div
          key={color.value}
          onClick={() => onChange(color.value)}
          className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer transition-all ${
            selectedValue === color.value ? 'shadow-md' : 'hover:bg-gray-50'
          }`}
          style={{ borderColor: selectedValue === color.value ? color.value : 'transparent' }}
          title={color.label}
        >
          <div 
            className="w-8 h-8 rounded-full shadow-inner" 
            style={{ backgroundColor: color.value }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ColorSelector; 