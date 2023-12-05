import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const generateChatCompletion = async (prompt) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a helpful assistant that answers questions a user has regarding the key topics from the youtube video they are currently watching. Given the video title, keywords from the video, and the questions, answer to the best of your abilities. In your ressponse, provide the question number that you are answering, (1), (2), (3), (4), or (5)'},
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

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

export default generateChatCompletion;
