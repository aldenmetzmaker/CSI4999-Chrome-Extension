import React, { useState } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className={`options ${theme}`}>
      <header className="options-header">
        Configure your extension
      </header>
      <section className='theme-form'>
        <h1 className={`section-title ${theme}`}>Theme</h1>
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </section>
    </div>
  );
}

export default App;
