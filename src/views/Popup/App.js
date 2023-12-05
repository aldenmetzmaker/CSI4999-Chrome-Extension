import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "./App.css";
import ResultsCard from "../components/ResultsCard";
import generateChatCompletion from '../../api/openaiApi.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
class App extends React.Component {
  state = {
    videos: [],
    loading: true,
    videoId: null,
    videoData: null,
    videoTitle: null,
    prompt: null,
    keywords: ['', '', ''],
    openAIResponse: {
      questionOne: null,
      questionTwo: null,
      questionThree: null,
      questionFour: null,
      questionFive: null,
    },
    userQuestions: {
      peopleQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      movieQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      videoGameQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      techQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      anyQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      },
      historyQuestions: {
        questionOne: '',
        questionTwo: '',
        questionThree: '',
        questionFour: '',
        questionFive: '',
      }
    },
    videoCategory: null,
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
    chrome.storage.local.get(["openaiResponse"], (result) => {
      const response = result.openaiResponse;
      console.log("Retrieved video ID:", response);
      // Split the response at (1), (2), (3), (4), and (5)
      const parts = response.split(/\(\d\)\s/);

      // Filter out any empty strings from the array
      const filteredParts = parts.filter(part => part.trim() !== '');
      const answers = {
        questionOne: filteredParts[0],
        questionTwo: filteredParts[1],
        questionThree: filteredParts[2],
        questionFour: filteredParts[3],
        questionFive: filteredParts[4],
      };
      console.log(answers)
      // Set videoId state
      this.setState({ openAIResponse: answers, }, () => {
        console.log("Updated response state:", this.state.openAIResponse);
      });
    });
    chrome.storage.local.get(["preferredQuestions"], (result) => {
      const questions = result.preferredQuestions;
      console.log("Retrieved questions:", questions);

      // Set videoId state
      this.setState({ userQuestions: questions }, () => {
        console.log("Updated videoId state:", this.state.userQuestions);
      });
    });
    chrome.storage.local.get(["videoCategory"], (result) => {
      const category = result.videoCategory;
      console.log("Retrieved category:", category);

      this.setState({ videoCategory: category }, () => {
        console.log("Updated videoId state:", this.state.videoCategory);
      });
    });
    chrome.storage.local.get(["keywords"], (result) => {
      const keywordTemp = result.keywords;
      console.log("Retrieved keywords:", keywordTemp);

      this.setState({ keywords: keywordTemp }, () => {
        console.log("Updated keywords state:", this.state.keywords);
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
      } else if(message.keyTag) {
        this.setState(
          {
            keywords: message.keyTag,
          },
          () => {
            console.log(
              "Updated keywords state:",
              this.state.keywords,
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
    this.setState({ loading: false }, () => { });
  }
  handleOptionsPageClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      questionOne,
      questionTwo,
      questionThree,
      questionFour,
      questionFive,
    } = this.state.userQuestions.techQuestions;
    const prompt = `Video title: ${this.state.videoTitle}, Keywords: react tutorial for beginners, react crash course, react js tutorial, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    let completion
    try {
      completion = await generateChatCompletion(prompt);
      this.setState({ openAIResponse: completion })
    } catch (error) {
      console.error('Error:', error);
    }
    chrome.storage.local.set({ openaiResponse: completion }, () => {
      console.log('Preferred questions set:', completion);
    });
    console.log(this.state.userQuestions.techQuestions)
    console.log(prompt);
    console.log(completion)
  };

  render() {
    return (
      <div className="popup">
        <header className="popup-header">
          <h2 className="popup-title">Click Search - Key Topics:</h2>
          <span className="tag-item">
            {this.state.keywords[0]}
          </span>
          <span className="tag-item">
            {this.state.keywords[1]}
          </span>
          <span className="tag-item">
            {this.state.keywords[2]}
          </span>
          <button
            onClick={this.handleOptionsPageClick}
            className="options-page-button"
          >
            <img src="../../../logo193.png" alt="logo" class="logo"></img>
          </button>
        </header>
        {/* <h2 className="title-text">
          
        </h2> */}
        {/* <button
            onClick={this.handleSubmit}
          >send openai request</button> */}
        {!this.state.loading ? (

          <div className="results">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
            >
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionOne}
                  text={this.state.openAIResponse.questionOne}
                /></SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionTwo}
                  text={this.state.openAIResponse.questionTwo}
                /></SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionThree}
                  text={this.state.openAIResponse.questionThree}
                /></SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionFour}
                  text={this.state.openAIResponse.questionFour}
                /></SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionFive}
                  text={this.state.openAIResponse.questionFive}
                /></SwiperSlide>
            </Swiper>
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
