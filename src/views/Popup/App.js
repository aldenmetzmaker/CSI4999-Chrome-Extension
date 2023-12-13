import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "./App.css";
import ResultsCard from "../components/ResultsCard";
import generateChatCompletion from '../../api/openaiApi.js';
import getCategory from '../../api/getCategory.js';
import getTagResponse from '../../api/getTagResponse.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
class App extends React.Component {
  state = {
    videos: [],
    tags: null,
    showResults: true,
    loading: true,
    videoId: null,
    videoData: null,
    videoTitle: null,
    prompt: null,
    keywords: ['', '', ''],
    storedOpenaiResponse: null,
    categoryResponse: null,
    currentQuestions: {
      questionOne: null,
      questionTwo: null,
      questionThree: null,
      questionFour: null,
      questionFive: null,
    },
    channelName: null,
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
    chrome.storage.local.get(["theme"], (result) => {
      const themeTemp = result.theme;
      console.log("Retrieved theme:", themeTemp);
      if (themeTemp) {
        this.setState({ theme: themeTemp }, () => {
          console.log("Updated theme state:", this.state.theme);
        });
      }
    });
    chrome.storage.local.get(["categoryResponse"], (result) => {
      const categoryTemp = result.categoryResponse;
      console.log("Retrieved category:", categoryTemp);
      if (categoryTemp) {
        this.setState({ categoryResponse: categoryTemp }, () => {
          console.log("Updated category state:", this.state.categoryResponse);
        });
      }
    });
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
      this.setState({ storedOpenaiResponse: response, }, () => {
        console.log("Updated response state:", this.state.storedOpenaiResponse);
      });
    });

    chrome.storage.local.get(["videoCategory"], (result) => {
      const category = result.videoCategory;
      console.log("Retrieved category:", category);

      this.setState({ videoCategory: category }, () => {
        console.log("Updated videoId state:", this.state.videoCategory);
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
      } else if (message.keyTag) {
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
    const youtubeResult = await chrome.storage.local.get(["apiResponse"]);
    const youtubeData = youtubeResult.apiResponse;
    this.setState(
      {
        videoData: youtubeData,
        videoTitle: youtubeData[0].snippet.title,
        tags: youtubeData[0].snippet.tags ? youtubeData[0].snippet.tags : null,
        channelName: youtubeData[0].snippet.channelTitle,
      }
    );
    const keyTagsResult = await chrome.storage.local.get(["keywords"]);
    const tags = keyTagsResult.keywords;
    this.setState({ keywords: tags }, () => {
      console.log("Updated keywords state:", this.state.keywords);
    });
    const preferredQuestionsResult = await chrome.storage.local.get(["preferredQuestions"]);
    const questions = preferredQuestionsResult.preferredQuestions;
    console.log("Retrieved questions:", questions);
    this.setState({ userQuestions: questions }, () => {
      console.log("Updated questions state:", this.state.userQuestions);
      if (this.state.storedOpenaiResponse.videoId !== this.state.videoId) {
        this.getCategoryResponse();
      }
      else {
        this.setState({ openAIResponse: this.state.storedOpenaiResponse })
        this.setState({ loading: false });
      }
      // this.handleSubmit();
    });
  }
  handleOptionsPageClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };
  getCategoryResponse = async () => {
    let combinedTags;
    if (this.state.tags) {
      combinedTags = this.state.tags.join(', ');
    }
    const prompt = `Video title: ${this.state.videoTitle}, Channel name: ${this.state.channelName} key tags: ${combinedTags},`;
    let completion;
    try {
      completion = await getCategory(prompt);
      this.setState({ categoryResponse: completion }, () => {
        this.handleSubmit();
      });
    } catch (error) {
      console.error('Error:', error);
    }
    completion.videoId = this.state.videoId;
    chrome.storage.local.set({ categoryResponse: completion }, () => {
      console.log('category set:', completion);
    });
    console.log("category prompt:", prompt);
    console.log(completion);

  };
  handleSubmit = async () => {
    let questionOne, questionTwo, questionThree, questionFour, questionFive;
    let prompt;
    if (this.state.categoryResponse.category === "movie") {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.movieQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.movieQuestions });
      prompt = `Answer the following questions about the tv show discussed in this youtube video. Video title: ${this.state.videoTitle}, Channel name: ${this.state.channelName} key topics: ${this.state.categoryResponse.topics[0]},  ${this.state.categoryResponse.topics[1]},  ${this.state.categoryResponse.topics[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;

    }
    else if (this.state.categoryResponse.category === "tv show") {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.showQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.showQuestions });
      prompt = `Answer the following questions about the tv show discussed in this youtube video. Video title: ${this.state.videoTitle}, Channel name: ${this.state.channelName} key topics: ${this.state.categoryResponse.topics[0]},  ${this.state.categoryResponse.topics[1]},  ${this.state.categoryResponse.topics[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;

    }
    else if (this.state.categoryResponse.category === "technology") {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.techQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.techQuestions });
      prompt = `Answer the following questions about the technology discussed in this youtube video. Video title: ${this.state.videoTitle}, Channel name: ${this.state.channelName} key topics: ${this.state.categoryResponse.topics[0]},  ${this.state.categoryResponse.topics[1]},  ${this.state.categoryResponse.topics[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    }
    else if (this.state.categoryResponse.category === "content creator") {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.contentCreatorQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.contentCreatorQuestions });
      prompt = `Answer the following questions about this specific youtube channel. Channel name: ${this.state.channelName}  Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    }
    else if (this.state.categoryResponse.category === "video games") {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.videoGameQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.videoGameQuestions });
      prompt = `Answer the following questions about the video game discussed in this youtube video. Video title: ${this.state.videoTitle}, Channel name: ${this.state.channelName} key topics: ${this.state.categoryResponse.topics[0]},  ${this.state.categoryResponse.topics[1]},  ${this.state.categoryResponse.topics[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    }
    let completion;
    try {
      completion = await generateChatCompletion(prompt);
      completion.questionOne = this.state.currentQuestions.questionOne;
      completion.questionTwo = this.state.currentQuestions.questionTwo;
      completion.questionThree = this.state.currentQuestions.questionThree;
      completion.questionFour = this.state.currentQuestions.questionFour;
      completion.questionFive = this.state.currentQuestions.questionFive;
      this.setState({ openAIResponse: completion });
    } catch (error) {
      console.error('Error:', error);
    }
    completion.videoId = this.state.videoId;
    completion.category = this.state.categoryResponse.category;
    chrome.storage.local.set({ openaiResponse: completion }, () => {
      console.log('openai answers set:', completion);
    });

    console.log(prompt);
    console.log(completion);
    this.setState({ loading: false });
  };
  handleTagClick = async (selectedCreator, clickedItem) => {
    this.setState({ loading: true });
    let questionOne, questionTwo, questionThree, questionFour, questionFive;
    let prompt;
    if (!selectedCreator) {
      if (this.state.categoryResponse.category === "movie") {
        ({
          questionOne,
          questionTwo,
          questionThree,
          questionFour,
          questionFive,
        } = this.state.userQuestions.movieQuestions);
        this.setState({ currentQuestions: this.state.userQuestions.movieQuestions })
      }
      else if (this.state.categoryResponse.category === "tv show") {
        ({
          questionOne,
          questionTwo,
          questionThree,
          questionFour,
          questionFive,
        } = this.state.userQuestions.showQuestions);
        this.setState({ currentQuestions: this.state.userQuestions.showQuestions })

      }
      else if (this.state.categoryResponse.category === "technology") {
        ({
          questionOne,
          questionTwo,
          questionThree,
          questionFour,
          questionFive,
        } = this.state.userQuestions.techQuestions);
        this.setState({ currentQuestions: this.state.userQuestions.techQuestions })
      }
      else if (this.state.categoryResponse.category === "content creator") {
        ({
          questionOne,
          questionTwo,
          questionThree,
          questionFour,
          questionFive,
        } = this.state.userQuestions.contentCreatorQuestions);
        this.setState({ currentQuestions: this.state.userQuestions.contentCreatorQuestions })
      }
      else if (this.state.categoryResponse.category === "video games") {
        ({
          questionOne,
          questionTwo,
          questionThree,
          questionFour,
          questionFive,
        } = this.state.userQuestions.videoGameQuestions);
        this.setState({ currentQuestions: this.state.userQuestions.videoGameQuestions })
      }
      prompt = `Give an insightful summary about this topic. key topic: ${clickedItem}`;
    }
    else {
      ({
        questionOne,
        questionTwo,
        questionThree,
        questionFour,
        questionFive,
      } = this.state.userQuestions.contentCreatorQuestions);
      this.setState({ currentQuestions: this.state.userQuestions.contentCreatorQuestions })
      prompt = `Answer the following questions about the specific youtube channel. Channel name: ${this.state.channelName}  Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    }
    let completion;
    if (selectedCreator) {
      try {
        completion = await generateChatCompletion(prompt);
        completion.questionOne = this.state.currentQuestions.questionOne;
        completion.questionTwo = this.state.currentQuestions.questionTwo;
        completion.questionThree = this.state.currentQuestions.questionThree;
        completion.questionFour = this.state.currentQuestions.questionFour;
        completion.questionFive = this.state.currentQuestions.questionFive;
        this.setState({ openAIResponse: completion });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        completion = await getTagResponse(prompt);
        this.setState({ tagResponse: completion });
      } catch (error) {
        console.error('Error:', error);
      }
    }
    if (selectedCreator) {
      completion.videoId = this.state.videoId;
      completion.category = this.state.categoryResponse.category;
      chrome.storage.local.set({ openaiResponse: completion }, () => {
        console.log('openai answers set:', completion);
      });
    } else {
      this.setState({showResults: false})
      this.setState({modalTitle: clickedItem})
    }
    console.log(prompt);
    console.log(completion);
    this.setState({ loading: false });
  };
  goBack =  () => {
    this.setState({showResults: true})
  };

  render() {
    return this.state.showResults ? (
      <div className={`popup ${this.state.theme}`}>

        {!this.state.loading ? (
          <>
            <header className="popup-header">
              <h2 className="popup-title">Click Search</h2>
              <span onClick={() => this.handleTagClick(false, this.state.categoryResponse.topics[0])} className="filter-item" title="Click to generate summary on topic">
                {this.state.categoryResponse.topics[0]}
              </span>
              <span onClick={() => this.handleTagClick(false, this.state.categoryResponse.topics[1])} className="filter-item" title="Click to generate summary on topic">
                {this.state.categoryResponse.topics[1]}
              </span>
              <span onClick={() => this.handleTagClick(true, this.state.channelName)} className="filter-item" title="Click to search about channel">
                {this.state.keywords[2]}
              </span>
              <button
                onClick={this.handleOptionsPageClick}
                className="options-page-button"
              >
                <img src="../../../logo193.png" alt="logo" class="logo"></img>
              </button>
            </header>
            <div className="results">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                navigation
                pagination={{ clickable: true }}
              >
                <SwiperSlide>
                  <ResultsCard
                    theme={this.state.theme}
                    title={this.state.openAIResponse.questionOne}
                    text={this.state.openAIResponse.one}
                  /></SwiperSlide>
                <SwiperSlide>
                  <ResultsCard
                    theme={this.state.theme}
                    title={this.state.openAIResponse.questionTwo}
                    text={this.state.openAIResponse.two}
                  /></SwiperSlide>
                <SwiperSlide>
                  <ResultsCard
                    theme={this.state.theme}
                    title={this.state.openAIResponse.questionThree}
                    text={this.state.openAIResponse.three}
                  /></SwiperSlide>
                <SwiperSlide>
                  <ResultsCard
                    theme={this.state.theme}
                    title={this.state.openAIResponse.questionFour}
                    text={this.state.openAIResponse.four}
                  /></SwiperSlide>
                <SwiperSlide>
                  <ResultsCard
                    theme={this.state.theme}
                    title={this.state.openAIResponse.questionFive}
                    text={this.state.openAIResponse.five}
                  /></SwiperSlide>
              </Swiper>
            </div>
          </>
        ) : (
          <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        )}
      </div>
    ) : (
      <div className="popup">
        <div className={`user-select ${this.state.theme}`}>
          <div className={`user-select-header ${this.state.theme}`}>
            <span onClick={() => this.goBack()} className="filter-item green" title="click to go back">Go Back</span>
            <h1>{this.state.modalTitle}</h1>
          </div>
          <div className="summary">
            <ResultsCard
                    theme={this.state.theme}
                    title={''}
                    text={this.state.tagResponse.summary}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
