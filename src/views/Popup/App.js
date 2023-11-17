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
  // TODO may need function in the future
  handleSubmit = async () => {
    // probably will replace with a message to service worker, and handle requests from there
    // const response = await youtube.get('/videos', {
    //   params: {
    //     id: this.state.videoId
    //   }
    // })
    // console.log(this.state.videoId)
    // this.setState({
    //   videos: response.data.items,
    // })
    // console.log(this.state.videos);
  };

  render() {
    return (
      <div className="popup">
        <header className="popup-header">
          <h1> Click Search - A React Extension</h1>
          <button className="options-page-button">
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
          "TODO insert loading indicator here"
        )}
      </div>
    );
  }
}

export default App;
