import React, { useState } from 'react'
import './App.css'
import ResultsCard from '../components/ResultsCard'
import youtube from '../../api/youtube.js'


class App extends React.Component{
  state = {
    videos: [],
    loading: false,
    videoId: null
  }
  componentDidMount() {
    chrome.storage.sync.get(["videoId"], function(result) {
      const videoId = result.videoId;
      console.log("Retrieved video ID: " + videoId);
      
      this.setState({ videoId: result.videoId });
    }.bind(this));
  }
  handleSubmit = async () => {
    this.setState({termFromSearchBar: "vue 3 skills"})
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