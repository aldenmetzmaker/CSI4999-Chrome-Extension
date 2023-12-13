import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const getTagResponse = async (prompt) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a helpful assistant that helps an application summarize the key topic from the youtube video they are currently watching. The topics may be related to movies, tv shows, technology, content creators, or video games.  Provide insigtful information about the topic.  provide your response only in JSON format, with the following Schema, {"summary": "<answer>"}'},
          { role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 400,
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

export default getTagResponse;
