import React, { useState, useEffect } from "react";
import "./App.css";
import QuestionInputForm from "../components/QuestionInputForm";

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
  const [showSaved, setShowSaved] = useState(false);
  const [formToShow, setFormToShow] = useState("");
  const [preferredQuestions, setPreferredQuestions] = useState({
    peopleQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
    movieQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
    videoGameQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
    techQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
    anyQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
    historyQuestions: {
      questionOne: "",
      questionTwo: "",
      questionThree: "",
      questionFour: "",
      questionFive: "",
    },
  });
  useEffect(() => {
    // Fetch data from storage and set preferredQuestions state
    chrome.storage.local.get(["preferredQuestions"], (result) => {
      const storedQuestions = result.preferredQuestions || null;
      console.log(result);
      if (storedQuestions) {
        setPreferredQuestions(storedQuestions);
      }
    });
  }, []);
  const handleInputChange = (section, fieldName, event) => {
    // Update the state with the new value
    setPreferredQuestions((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [fieldName]: event.target.value,
      },
    }));
  };
  // gets called when input element is changed, and updates state. this dynamically sets the css class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  const saveQuestions = () => {
    chrome.storage.local.set({ preferredQuestions: preferredQuestions }, () => {
      console.log("Preferred questions set:", preferredQuestions);
    });
    setShowSaved(true);
    setTimeout(() => {
      // Set showSaved back to false after 3 seconds
      setShowSaved(false);
    }, 3000);
  };
  const clearQuestions = (section) => {
    setPreferredQuestions((prevState) => ({
      ...prevState,
      [section]: Object.fromEntries(
        Object.keys(prevState[section]).map((key) => [key, ""])
      ),
    }));
    console.log(preferredQuestions);
  };
  const showForm = (formName) => {
    setFormToShow(formName);
  };
  return (
    <div className={`options ${theme}`}>
      <header className="options-header">
        <h1>Configure Your Extension</h1>
      </header>
      <section className="theme-form">
        <h1 className={`section-title ${theme}`}>Theme</h1>
        <br />
        <span className="filter-item" onClick={toggleTheme}>
          {theme}
        </span>
        <span className="filter-item" onClick={toggleTheme}>
          {theme}
        </span>
      </section>
      <section className="options-prompts">
        <h2>Configure Prompts</h2>
        <section className="prompts-pre-set">
          <div className="category-select-wrapper">
            <h3 className="category-select-h3">Select a Category:</h3>
            <br />
            <span onClick={() => showForm("people")} className="filter-item">
              People
            </span>
            <span
              onClick={() => showForm("videoGames")}
              className="filter-item"
            >
              Video Games
            </span>
            <span onClick={() => showForm("movies")} className="filter-item">
              Movies/TV
            </span>
            <span onClick={() => showForm("tech")} className="filter-item">
              Technology
            </span>
            <span onClick={() => showForm("history")} className="filter-item">
              History
            </span>
            <span onClick={() => showForm("any")} className="filter-item">
              Any
            </span>
          </div>
        </section>
        {formToShow === "people" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.peopleQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"peopleQuestions"}
            title={"People"}
          />
        )}
        {formToShow === "tech" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.techQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"techQuestions"}
            title={"Technology"}
          />
        )}
        {formToShow === "movies" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.movieQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"movieQuestions"}
            title={"Movies/TV"}
          />
        )}
        {formToShow === "videoGames" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.videoGameQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"videoGameQuestions"}
            title={"Video Games"}
          />
        )}
        {formToShow === "history" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.videoGameQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"historyQuestions"}
            title={"History"}
          />
        )}
        {formToShow === "any" && (
          <QuestionInputForm
            preferredQuestions={preferredQuestions.anyQuestions}
            handleInputChange={handleInputChange}
            saveQuestions={saveQuestions}
            clearQuestions={clearQuestions}
            sectionName={"anyQuestions"}
            title={"Any"}
          />
        )}
        {showSaved ? <span>Saved successfully</span> : ""}
      </section>
    </div>
  );
}

export default App;
