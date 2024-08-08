npx create-next-app@latest my-chatbot
cd my-chatbot
npm run dev
npm install axios
import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await axios.post('/api/chat', { messages: updatedMessages });
      const botMessage = { role: 'bot', content: response.data.reply };
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error('Error communicating with API:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type your message..." 
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chatbot;
import axios from 'axios';

export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',  // Use 'gpt-3.5-turbo' if you don't have GPT-4 access
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
}
OPENAI_API_KEY=your-openai-api-key
import Chatbot from '../components/Chatbot';

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Chatbot</h1>
      <Chatbot />
    </div>
  );
}
npm run dev
