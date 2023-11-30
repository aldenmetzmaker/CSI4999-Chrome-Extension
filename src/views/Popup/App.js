import React, { useState, useEffect } from "react";
import "./App.css";
import ResultsCard from "../components/ResultsCard";
// import youtube from '../../api/youtube.js' <- replacing with requests from service worker

class App extends React.Component {
  state = {
    videos: [],
    loading: false,
    videoId: null,
    videoData: null,
    videoTitle: null,
  };
  // will eventually remove the console logs, but are there now for testing
  // view them by inspecting the popup
  async componentDidMount() {
    // Retrieve videoId from chrome.storage.local
    chrome.storage.local.get(["videoId"], (result) => {
      const videoIdTemp = result.videoId;
      console.log("Retrieved video ID:", videoIdTemp);

      // Set videoId state
      this.setState({ videoId: videoIdTemp }, () => {
        console.log("Updated videoId state:", this.state.videoId);
      });
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.data) {
        // Set videoData state when a message is received
        this.setState(
          {
            videoData: message.data,
            videoTitle: message.data.items[0].snippet.title,
          },
          () => {
            console.log(
              "Updated videoData state:",
              this.state.videoData,
              this.state.videoTitle
            );
          }
        );
      }
    });

    // Retrieve videoData from chrome.storage.local
    chrome.storage.local.get("apiResponse", (result) => {
      const videoDataTemp = result.apiResponse;
      console.log("Retrieved videoData from storage:", videoDataTemp);

      // Set videoData, videoTitle state
      this.setState(
        {
          videoData: videoDataTemp,
          videoTitle: videoDataTemp[0].snippet.title,
        },
        () => {
          console.log(
            "Updated videoData, videoTitle state:",
            this.state.videoData,
            this.state.videoTitle
          );
        }
      );
    });
  }
  handleOptionsPageClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };
  // TODO may need function in the future
  handleSubmit = async () => {
    this.setState({ loading: true }); // Set loading state to true before making the request
  
    try {
      // Simulating an asynchronous operation (replace this with your actual API request)
      const response = await PUTAPIREQUESTHERE(); // HANDLE THE API REQUEST HERE
  
      // Once the API request is completed, update the state with the response
      this.setState({
        videos: response.data.items,
        loading: false, // Set loading to false after getting the response
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors if the API request fails
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="popup">
        <header className="popup-header">
          <h1>Click Search - A React Extension</h1>
          <button
            onClick={this.handleOptionsPageClick}
            className="options-page-button"
          >
            <img src="../../../logo193.png" alt="logo" class="logo"></img>
          </button>
        </header>
        <h2 className="title-text">
          Showing Results For: {this.state.videoTitle}
        </h2>
        {!this.state.loading ? (
          <div className="results">
            <ResultsCard
              title="Sample Title"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum."
            />
            <ResultsCard
              title="Sample Title"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum."
            />
            <ResultsCard
              title="Sample Title"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum."
            />
            <ResultsCard
              title="Sample Title"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum."
            />
          </div>
        ) : (
          <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
