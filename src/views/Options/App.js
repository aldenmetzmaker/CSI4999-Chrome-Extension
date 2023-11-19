import React, { useState, useEffect } from "react";
import "./App.css";

// TODO - Need to create react componenets for various parts of this page
// place component files into src/components and import them. reference the resultsCard component for component setup
// store user settings to chrome.storage
// fetch stored data and set react state
// user settings for theme, default prompt questions - other
// create a way to apply css styling for multiple user input themes
// the example now with toggle theme shows how to dynamically set css classes
// may move the input section into its own component file -> pass in props for different question sets
function App() {
  // state variable declaration [variableName, set function]
  const [theme, setTheme] = useState("dark");
  const [preferredQuestions, setPreferredQuestions] = useState({
    questionOne: '',
    questionTwo: '',
    questionThree: '',
    questionFour: '',
    questionFive: '',
  });
  useEffect(() => {
    // Fetch data from storage and set preferredQuestions state
    chrome.storage.local.get(['preferredQuestions'], (result) => {
      const storedQuestions = result.preferredQuestions || {};
      console.log(result)
      setPreferredQuestions(storedQuestions);
    });
  }, []);
  const handleInputChange = (fieldName, event) => {
    // Update the state with the new value
    setPreferredQuestions({
      ...preferredQuestions,
      [fieldName]: event.target.value,
    });
  };
  // gets called when input element is changed, and updates state. this dynamically sets the css class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  const saveQuestions = () => {
    chrome.storage.local.set({ preferredQuestions: preferredQuestions }, () => {
      console.log('Preferred questions set:', preferredQuestions);
    });
  };
  const clearQuestions = () => {
    // clear values
    setPreferredQuestions({
      questionOne: '',
      questionTwo: '',
      questionThree: '',
      questionFour: '',
      questionFive: '',
    })
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
          <h3>Filter by Category:</h3>
          <section className="prompts-input">
            <input type="radio" id="people"></input>
            <label for="people">People</label>
            <input type="radio" id="movies-tv"></input>
            <label for="movies-tv">Movies/TV</label>
            <input type="radio" id="technology"></input>
            <label for="technology">Technology</label>
            <input type="radio" id="video-games"></input>
            <label for="video-games">Video Games</label>
            <input type="radio" id="history"></input>
            <label for="history">History</label>
            <input type="radio" id="any"></input>
            <label for="any">Any</label>
          </section>
        </section>
        <section className="prompts-user-set">
          <h2>Set Custom Prompts:</h2>
          <div>
            <div className="input-wrapper">
              <label htmlFor={'questionOne'} className="prompt-input-label">Preferred Question 1:</label>
              <input
                type="text"
                id={'questionOne'}
                value={preferredQuestions.questionOne}
                placeholder={preferredQuestions.questionOne.length > 1 ? '' : 'Question 1'}
                onChange={(event) => handleInputChange('questionOne', event)}
                className="prompt-input"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor={'questionTwo'} className="prompt-input-label">Preferred Question 2:</label>
              <input
                type="text"
                id={'questionTwo'}
                value={preferredQuestions.questionTwo}
                placeholder={preferredQuestions.questionTwo.length > 1 ? '' : 'Question 2'}
                onChange={(event) => handleInputChange('questionTwo', event)}
                className="prompt-input"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor={'questionThree'} className="prompt-input-label">Preferred Question 3:</label>
              <input
                type="text"
                id={'questionThree'}
                value={preferredQuestions.questionThree}
                placeholder={preferredQuestions.questionThree.length > 1 ? '' : 'Question 3'}
                onChange={(event) => handleInputChange('questionThree', event)}
                className="prompt-input"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor={'questionFour'} className="prompt-input-label">Preferred Question 4:</label>
              <input
                type="text"
                id={'questionFour'}
                value={preferredQuestions.questionFour}
                placeholder={preferredQuestions.questionFour.length > 1 ? '' : 'Question 4'}
                onChange={(event) => handleInputChange('questionFour', event)}
                className="prompt-input"
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor={'questionFive'} className="prompt-input-label">Preferred Question 5:</label>
              <input
                type="text"
                id={'questionFive'}
                value={preferredQuestions.questionFive}
                placeholder={preferredQuestions.questionFive.length > 1 ? '' : 'Question 5'}
                onChange={(event) => handleInputChange('questionFive', event)}
                className="prompt-input"
              />
            </div>
            <div className="button-container">
              <button className="button-main submit" onClick={saveQuestions}>Submit</button>
              <button className="button-main clear" onClick={clearQuestions}>Clear</button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default App;
