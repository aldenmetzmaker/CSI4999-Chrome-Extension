import React, { useState, useEffect } from 'react'
import './App.css'
import ResultsCard from '../components/ResultsCard'
import youtube from '../../api/youtube.js'


class App extends React.Component {
  state = {
    videos: [],
    loading: false,
    videoId: null,
    videoData: null,
  }
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
        this.setState({ videoData: message.data }, () => {
          console.log("Updated videoData state:", this.state.videoData);
        });
      }
    });
  
    // Retrieve videoData from chrome.storage.local
    chrome.storage.local.get("apiResponse", (result) => {
      const videoDataTemp = result.apiResponse;
      console.log('Retrieved videoData from storage:', videoDataTemp);
  
      // Set videoData state
      this.setState({ videoData: videoDataTemp }, () => {
        console.log("Updated videoData state:", this.state.videoData);
      });
    });
  }
  handleSubmit = async () => {
    const response = await youtube.get('/videos', {
      params: {
        id: this.state.videoId
      }
    })
    console.log(this.state.videoId)
    this.setState({
      videos: response.data.items
    })
    console.log(response.data.items);
  }

  render () {
    return (
      <div className='popup'>
        <div className='search-wrapper'>
          <h2 className='title-text text--lg'>(Topic Name Here)</h2>
          <button onClick={this.handleSubmit}>
            console log video data
          </button>
          {!this.state.loading ? (<div className='results'>
            <ResultsCard
              title='Sample Title'
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
            />
            <ResultsCard
              title='Sample Title'
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
            />
            <ResultsCard
              title='Sample Title'
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
            />
            <ResultsCard
              title='Sample Title'
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget turpis nec mauris commodo interdum.'
            />
          </div>) : ('insert loading indicator here')}

        </div>
      </div>
    )
  }
}

export default App;