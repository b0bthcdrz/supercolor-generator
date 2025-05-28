import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Download, Sliders, Copy, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { generateMonochromaticPalette, hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/colorUtils';
import ColorSwatch from './ColorSwatch';

const ColorGenerator: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [baseColor, setBaseColor] = useState('#6366F1');
  const [paletteSize, setPaletteSize] = useState(10);
  const [palette, setPalette] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteSize]);

  const generatePalette = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = generateMonochromaticPalette(baseColor, paletteSize);
      setPalette(newPalette);
      setIsGenerating(false);
    }, 300);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
    if (value.length > 6) value = value.slice(0, 6);
    setBaseColor(`#${value}`);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaletteSize(parseInt(e.target.value));
  };

  const handleRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  const downloadPalette = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const swatchWidth = 100;
    const swatchHeight = 150;
    const padding = 20;
    const labelHeight = 40;
    const colorsPerRow = Math.min(10, palette.length);
    const rows = Math.ceil(palette.length / colorsPerRow);
    
    canvas.width = (swatchWidth + padding) * colorsPerRow + padding;
    canvas.height = (swatchHeight + padding + labelHeight) * rows + padding * 2;
    
    // Fill background
    ctx.fillStyle = isDarkMode ? '#1F2937' : '#F9FAFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = isDarkMode ? '#F9FAFB' : '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Monochromatic Palette', canvas.width / 2, padding + 16);
    
    // Draw swatches
    palette.forEach((color, index) => {
      const row = Math.floor(index / colorsPerRow);
      const col = index % colorsPerRow;
      const x = padding + col * (swatchWidth + padding);
      const y = padding + labelHeight + row * (swatchHeight + padding + labelHeight);
      
      // Draw color swatch
      ctx.fillStyle = color;
      ctx.fillRect(x, y, swatchWidth, swatchHeight);
      
      // Draw color code
      ctx.fillStyle = isDarkMode ? '#F9FAFB' : '#111827';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color.toUpperCase(), x + swatchWidth / 2, y + swatchHeight + 16);
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'monochromatic-palette.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          Monochromatic Palette Generator
        </h1>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="baseColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose Base Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="baseColor"
                value={baseColor}
                onChange={handleColorChange}
                className="h-12 w-12 rounded border-0 cursor-pointer"
              />
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500 dark:text-gray-400">#</span>
                <input
                  type="text"
                  value={baseColor.slice(1)}
                  onChange={handleColorInputChange}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-7 pr-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  maxLength={6}
                  pattern="[0-9a-fA-F]{6}"
                />
              </div>
              <button 
                onClick={handleRandomColor}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
                aria-label="Generate random color"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Random</span>
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="paletteSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Palette Size: {paletteSize}
            </label>
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-gray-500 dark:text-gray-400" />
              <input
                type="range"
                id="paletteSize"
                min="3"
                max="50"
                value={paletteSize}
                onChange={handleSizeChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Monochromatic Palette</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-8">
          {palette.map((color, index) => (
            <ColorSwatch key={index} color={color} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={downloadPalette}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-md"
          >
            <Download size={18} />
            Download Palette
          </button>
        </div>
      </div>

      {/* Hidden canvas for generating PNG */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default ColorGenerator;