import React, { useEffect, useState } from "react";
import "./App.css";

import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";

import ChatListItem from "./components/ChatList";
import ChatIntro from "./components/ChatIntro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/NewChat";
import Login from "./components/Login";

import Api from "./services/Api";

export default function App() {

  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (user !== null) {
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub
    }
  }, [user]);

  function handleNewChat() {
    setShowNewChat(true);
  }

  async function handleLoginData(UserData) {
    let newUser = {
      id: UserData.uid,
      name: UserData.displayName,
      avatar: UserData.photoURL,
    };
    await Api.addUser(newUser);
    setUser(newUser);
  }

  if (user === null) {
    return <Login onReceive={handleLoginData} />;
  }

  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatList={chatList}
          user={user}
          showOpenNewChat={showNewChat}
          setShowChat={setShowNewChat}
        />
        <header>
          <img className="header-avatar" src={user.avatar} alt="" />
          <div className="header-buttons">
            <div className="header-btn">
              <DonutLargeIcon style={{ color: "#919191" }} />
            </div>
            <div className="header-btn" onClick={handleNewChat}>
              <ChatIcon style={{ color: "#919191" }} />
            </div>
            <div className="header-btn">
              <MoreHorizIcon style={{ color: "#919191" }} />
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search-input">
            <SearchIcon fontSize="small" style={{ color: "#919191" }} />
            <input type="search" placeholder="Procurar Conversa" />
          </div>
        </div>

        <div className="chat-list">
          {chatList.map((Item, key) => (
            <ChatListItem
              data={Item}
              key={key}
              active={activeChat.chatId === chatList[key].chatId}
              onClick={() => setActiveChat(chatList[key])}
            />
          ))}
        </div>
      </div>
      <div className="content-area">
        {activeChat.chatId !== undefined && <ChatWindow user={user} data={activeChat}/>}
        {activeChat.chatId === undefined && <ChatIntro  />}
      </div>
    </div>
  );
}
