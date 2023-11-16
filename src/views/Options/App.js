import React, { useState } from "react";
import "./App.css";

// TODO - Need to create react componenets for various parts of this page
// place component files into src/components and import them. reference the resultsCard component for component setup
// store user settings to chrome.storage
// fetch stored data and set react state
// user settings for theme, default prompt questions - other
// create a way to apply css styling for multiple user input themes
// the example now with toggle theme shows how to dynamically set css classes
function App() {
  // state variable declaration [variableName, set function]
  const [theme, setTheme] = useState("dark");

  // gets called when input element is changed, and updates state. this dynamically sets the css class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className={`options ${theme}`}>
      <header className="options-header">
        <h1>Configure Your Extension</h1>
      </header>
      <section className="theme-form">
        <h1 className={`section-title ${theme}`}>Theme</h1>
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </section>
      <section className="options-prompts">
        <h2>Configure Prompts</h2>
        <section className="prompts-pre-set">
          <h2>Filter by Category:</h2>
        </section>
        <section className="prompts-user-set"></section>
        <h2>Set Custom Prompts:</h2>
      </section>
    </div>
  );
}

export default App;
