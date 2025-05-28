import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ColorGenerator from './components/ColorGenerator';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ColorGenerator />
      </div>
    </ThemeProvider>
  );
}

export default App;