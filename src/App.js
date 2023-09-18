import { useState, useEffect } from "react";
const App = () => {
  const [value, setvalue] = useState(null);
  const [message, setmessage] = useState(null);
  const [previouschat, setpreviouschat] = useState([]);
  const [currenttile, setcurrenttile] = useState(null);

  const createNewChat = () => {
    setmessage(null);
    setvalue("");
    setcurrenttile(null);
  }
  const handleClick = (uniqueTitles) => {
    setcurrenttile(uniqueTitles);
    setmessage(null);
    setvalue("");
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
      message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      debugger
      setmessage(data.choices[0].message);
    }
    catch (error) {
      console.log(error);
    }
  }
  console.log(message);
  useEffect(() => {
    console.log(currenttile, value, message);
    if (!currenttile && value && message) {
      setcurrenttile(value);
    }
    if (currenttile && value && message) {
      setpreviouschat(prevChats => (
        [...prevChats,
        {
          title: currenttile,
          role: "user",
          content: value
        },
        {
          title: currenttile,
          role: message.role,
          content: message.content
        }
        ]
      ));
    }
  }, [message, currenttile]);

  const currentChat = previouschat.filter(previouschat => previouschat.title === currenttile);
  const uniqueTitles = Array.from(new Set(previouschat.map(previouschat => previouschat.title)));
  console.log(uniqueTitles)
  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li>)}
        </ul>
        <nav>
          <p>Made By Akash ❤️</p>
        </nav>
      </section>
      <section className='main'>
        {!currenttile && <h1>Medical Encyclopedia</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setvalue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Akash GPT Mar 1st version. free Research Preview.
            Our goal is to make AI systems more natural and safe to intract with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}
export default App;
