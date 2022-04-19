import { useState } from "react";
import "./index.css";
import { FiSend } from "react-icons/fi";

const ChatSpace = ({
  members,
  chatRows,
  onPublicMessage,
  onPrivateMessage,
}) => {
  const [message, setMessage] = useState("");

  const sendPublicMessage = () => {
    onPublicMessage(message);
    setMessage("");
  };

  const setMessageInput = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="chat-container">
      <h1>Welcome to our Chat Room!</h1>
      <ul>
        {chatRows.map((item, i) => (
          <li key={i} style={{ paddingBottom: 9 }}>
            {item}
          </li>
        ))}
      </ul>
      <div className="bottom">
        <input type="text" value={message} onChange={setMessageInput} />
        <div className="icon-container" onClick={sendPublicMessage}>
          <h3>Send</h3>
          <FiSend size={25} className="icon" />
        </div>
      </div>
    </div>
  );
};

export default ChatSpace;
