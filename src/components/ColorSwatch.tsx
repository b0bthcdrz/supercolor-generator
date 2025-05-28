import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Calculate contrasting text color (simple version)
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate brightness (simplified formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(color);

  return (
    <div 
      className="group flex flex-col items-center rounded-md overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      style={{ backgroundColor: color }}
    >
      <div 
        className="w-full h-24 flex items-center justify-center cursor-pointer relative"
        onClick={copyToClipboard}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <button 
          className={`rounded-full p-1.5 transition-all duration-300 ${
            copied ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-700'
          }`}
          aria-label={copied ? "Copied!" : "Copy color code"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div 
        className="w-full py-2 px-3 text-center text-sm font-medium transition-colors"
        style={{ color: textColor }}
      >
        {color.toUpperCase()}
      </div>
    </div>
  );
};

export default ColorSwatch;