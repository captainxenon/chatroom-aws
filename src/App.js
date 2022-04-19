import "./App.css";
import UsersList from "./components/UsersList";
import ChatSpace from "./components/ChatSpace";
import { useState, useCallback, useEffect, useRef } from "react";

const URL = "wss://1vjcr4roe1.execute-api.us-east-1.amazonaws.com/production";

function App() {
  const socket = useRef();

  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState(["User1", "User2", "User3", "User4"]);
  const [chatRows, setChatRows] = useState([]);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    const name = prompt("Enter your name");
    socket.current?.send(JSON.stringify({ action: "setName", name }));
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);

  const onSocketMessage = useCallback((str) => {
    const data = JSON.parse(str);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows((prev) => [
        ...prev,
        <span>
          <b>{data.publicMessage}</b>
        </span>,
      ]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      setChatRows((prev) => [
        ...prev,
        <span>
          <i>{data.systemMessage}</i>
        </span>,
      ]);
    }
  }, []);

  const onDisconnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      alert("You need to connect first! :(");
      return;
    }
    socket.current?.close();
    setIsConnected(!isConnected);
    alert("You're successfully disconnected!");
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    } else {
      alert("Only one person at a time! :)");
      return;
    }
    setIsConnected(true);
    alert("You're successfully connected!");
  }, []);

  const sendPublicMessage = (msg) => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      alert("You need to connect first! :(");
      return;
    }
    socket.current?.send(
      JSON.stringify({
        action: "sendPublic",
        message: msg,
      })
    );
  };

  const sendPrivateMessage = () => {
    alert("SENT");
  };

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Chat<span>room</span> App
        </h1>
      </header>
      <div className="main">
        {/* <h4
          className={isConnected ? "connecting" : "connected"}
          onClick={onConnect}
        >
          {isConnected ? "• Connect" : "• Connected"}
        </h4> */}
        <h4 className="connecting" onClick={onConnect}>
          • Connect
        </h4>
        <h4 className="disconnecting" onClick={onDisconnect}>
          • Disconnect
        </h4>
        {/* <h4
          className={isConnected ? "disconnecting" : "disconnected"}
          onClick={onDisconnect}
        >
          {isConnected ? "• Disconnect" : "• Disconnected"}
        </h4> */}
        {/* <h4 onClick={onDisconnect}>Disconnect</h4> */}
        <div className="left">
          <UsersList users={members} />
        </div>
        <div className="separator"></div>
        <div className="right">
          <ChatSpace
            chatRows={chatRows}
            onPublicMessage={sendPublicMessage}
            onPrivateMessage={sendPrivateMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
