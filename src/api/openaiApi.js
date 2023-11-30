import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const generateChatCompletion = async (prompt) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
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
