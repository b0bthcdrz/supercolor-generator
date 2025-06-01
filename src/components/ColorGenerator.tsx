import React, { useState, useEffect, useRef } from 'react';
import { Download, Sliders, RefreshCw } from 'lucide-react';
import { 
  generateMonochromaticPalette, 
  generateShades, 
  generateTints, 
  generateTones,
  hexToRgb 
} from '../utils/colorUtils';
import ColorSwatch from './ColorSwatch';

type PaletteType = 'monochromatic' | 'shades' | 'tints' | 'tones';

const ColorGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#6366F1');
  const [paletteSize, setPaletteSize] = useState(10);
  const [palette, setPalette] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteSize, paletteType]);

  const generatePalette = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let newPalette: string[] = [];
      switch (paletteType) {
        case 'shades':
          newPalette = generateShades(baseColor, paletteSize);
          break;
        case 'tints':
          newPalette = generateTints(baseColor, paletteSize);
          break;
        case 'tones':
          newPalette = generateTones(baseColor, paletteSize);
          break;
        default:
          newPalette = generateMonochromaticPalette(baseColor, paletteSize);
      }
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
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette`, canvas.width / 2, padding + 16);
    
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
      ctx.fillStyle = '#111827';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color.toUpperCase(), x + swatchWidth / 2, y + swatchHeight + 16);
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${paletteType}-palette.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Color Palette Generator
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="baseColor" className="block text-sm font-medium text-gray-700 mb-2">
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
                <span className="absolute left-3 text-gray-500">#</span>
                <input
                  type="text"
                  value={baseColor.slice(1)}
                  onChange={handleColorInputChange}
                  className="bg-gray-50 border border-gray-300 rounded-md pl-7 pr-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={6}
                  pattern="[0-9a-fA-F]{6}"
                />
              </div>
              <button 
                onClick={handleRandomColor}
                className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-1"
                aria-label="Generate random color"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Random</span>
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="paletteSize" className="block text-sm font-medium text-gray-700 mb-2">
              Palette Size: {paletteSize}
            </label>
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-gray-500" />
              <input
                type="range"
                id="paletteSize"
                min="3"
                max="50"
                value={paletteSize}
                onChange={handleSizeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Palette Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['monochromatic', 'shades', 'tints', 'tones'] as PaletteType[]).map((type) => (
              <button
                key={type}
                onClick={() => setPaletteType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  paletteType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-8 transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette
        </h2>
        
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