// Convert hex color to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
};

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  return { h, s, l };
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Generate shades (mixing with black)
export const generateShades = (baseColor: string, count: number): string[] => {
  const rgb = hexToRgb(baseColor);
  const shades: string[] = [baseColor];

  for (let i = 1; i < count; i++) {
    const factor = 1 - (i / count);
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    shades.push(rgbToHex(r, g, b));
  }

  return shades;
};

// Generate tints (mixing with white)
export const generateTints = (baseColor: string, count: number): string[] => {
  const rgb = hexToRgb(baseColor);
  const tints: string[] = [baseColor];

  for (let i = 1; i < count; i++) {
    const factor = i / count;
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);
    tints.push(rgbToHex(r, g, b));
  }

  return tints;
};

// Generate tones (mixing with gray)
export const generateTones = (baseColor: string, count: number): string[] => {
  const rgb = hexToRgb(baseColor);
  const tones: string[] = [baseColor];

  for (let i = 1; i < count; i++) {
    const factor = i / count;
    const grayMix = 128;
    const r = Math.round(rgb.r + (grayMix - rgb.r) * factor);
    const g = Math.round(rgb.g + (grayMix - rgb.g) * factor);
    const b = Math.round(rgb.b + (grayMix - rgb.b) * factor);
    tones.push(rgbToHex(r, g, b));
  }

  return tones;
};

// Generate a monochromatic palette from a base color
export const generateMonochromaticPalette = (baseColor: string, count: number): string[] => {
  // Parse the base color
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Prepare the palette array
  const palette: string[] = [];
  
  // Calculate the lightness range and steps
  const lightnessRange = 0.98; // Range from almost white to almost black
  const baseIndex = Math.floor(count / 2); // Middle index for base color
  
  // Generate colors lighter than base color
  for (let i = 0; i < baseIndex; i++) {
    const step = (0.99 - hsl.l) / baseIndex;
    const newLightness = Math.min(0.99, 0.99 - i * step);
    const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  // Add base color
  palette.push(baseColor);
  
  // Generate colors darker than base color
  for (let i = 1; i < count - baseIndex; i++) {
    const step = (hsl.l - 0.01) / (count - baseIndex - 1);
    const newLightness = Math.max(0.01, hsl.l - i * step);
    const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return palette;
};