import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const currentUser = JSON.parse(user);
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const socket = io(process.env.REACT_APP_WS, {
        query: { token: user.token },
      });

      socket.emit('findAll', {}, (data) => {
        setMessages(data);
        socket.disconnect();
      });

      socket.on('error', () => {
        localStorage.removeItem('user');
        setUser(null);
      });
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') return;

    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());

    if (response.accessToken) {
      const newUser = {
        name: username,
        token: response.accessToken,
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      try {
        setError(response.message);
      } catch {
        setError(['Unknown Error']);
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message === '' || streaming) return;

    const newMessage = {
      content: message,
      role: 'user',
    };

    setMessages((messages) => [...messages, newMessage]);

    const socket = io(process.env.REACT_APP_WS, {
      query: { token: user.token },
    });

    socket.emit('stream', {
      message: message,
    });

    setStreaming(true);
    setMessage('');

    socket.on('stream', (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.message) {
        const newMessage = {
          content: parsedData.message,
          role: 'assistant',
        };
        setMessages((messages) => {
          if (messages[messages.length - 1].role === 'assistant') {
            messages[messages.length - 1].content = parsedData.message;
            return [...messages];
          } else {
            return [...messages, newMessage];
          }
        });
      }
    });

    socket.on('error', () => {
      setStreaming(false);
      localStorage.removeItem('user');
      setUser(null);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      setStreaming(false);
    });

    return () => {
      socket.disconnect();
    };
  };

  function NewlineText({ text }) {
    const newText = text.split('\n').map((str, index, array) =>
      index === array.length - 1 ? (
        str
      ) : (
        <span key={index}>
          {str}
          <br />
        </span>
      )
    );

    return <>{newText}</>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!user ? (
            <div className="Login-Box">
              <h1>Ws Client</h1>
              <form onSubmit={handleLogin}>
                <input
                  style={{
                    width: 300,
                    height: 30,
                    borderRadius: '10px',
                    marginTop: '20px',
                  }}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
                <br />
                <input
                  style={{
                    width: 300,
                    height: 30,
                    borderRadius: '10px',
                    marginTop: '20px',
                  }}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
                <br />
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
                  Login
                </button>
              </form>
              {error.length > 0 && (
                <div>
                  {error.map((err, index) => {
                    return (
                      <p
                        key={index}
                        style={{
                          fontSize: '20px',
                          color: 'magenta',
                        }}
                      >
                        {err}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div
                className="Chat-Box"
                style={{
                  width: 1400,
                  height: 800,
                  backgroundColor: 'rgb(25, 25, 25)',
                  borderRadius: '10px',
                  marginTop: '20px',
                  overflow: 'auto',
                  padding: '10px',
                }}
              >
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        maxWidth: '90%',
                        minWidth: '100px',
                        borderRadius: '20px',
                        backgroundColor:
                          message.role === 'user' ? 'blueviolet' : 'gray',
                        marginBottom: '10px',
                        clear: 'both',
                        float: message.role === 'user' ? 'right' : 'left',
                      }}
                    >
                      <p
                        style={{
                          marginTop: '10px',
                          marginBottom: '10px',
                          fontSize: '20px',
                          padding: '10px',
                        }}
                      >
                        <NewlineText text={message.content} />
                      </p>
                    </div>
                  );
                })}
              </div>
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
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
