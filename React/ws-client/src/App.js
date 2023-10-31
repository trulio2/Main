import { useState } from 'react';
import { io } from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message === '') return;

    const socket = io(process.env.REACT_APP_WS);

    socket.emit('stream', {
      message: message,
    });

    setMessage('');

    socket.on('stream', (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.message) setText(parsedData.message);
      else if (parsedData.error) {
        const error = parsedData.error.message[0];
        setText(error);
      }
    });

    return () => {
      socket.disconnect();
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <form onSubmit={handleSend}>
          <input
            style={{
              width: 300,
              height: 30,
              borderRadius: '10px',
              marginTop: '20px',
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>

          <button
            style={{
              width: 60,
              height: 30,
              backgroundColor: 'skyblue',
              borderRadius: '10px',
              marginLeft: '20px',
            }}
            type="submit"
          >
            Send
          </button>
        </form>
        <p
          style={{
            color: 'white',
            marginTop: '20px',
            fontSize: '20px',
          }}
        >
          {text}
        </p>
      </header>
    </div>
  );
}

export default App;
