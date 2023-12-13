import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const getCategory = async (prompt) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a helpful assistant that helps an application determine which set of questions to use depending on the category of a youtube video. You will be given data about a youtube video, the title, channel name, and video tags, determine which of the following categories best describes the video. Select from these categories ("content creator", "video games", "movie", "tv show", "technology"), and determine the key topics from the video data, as an array of 3 strings these key topics strings should make sense as a search topic to further and learn more about the current video. provide your response only in JSON format, with the following Schema, {"category": "<answer>", "topics": "<answer>"}'},
          { role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

export default getCategory;
