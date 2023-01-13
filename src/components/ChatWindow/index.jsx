import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import SearchIcon from "@mui/icons-material/Search";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import MicIcon from "@mui/icons-material/Mic";
import InputEmoji from "react-input-emoji";
import MessageItem from "../MessageItem";
import Api from "../../services/Api";
export default function ChatWindow({ user, data }) {
  const body = useRef();

  //reconhecimento de voz do navegador
  let recognition = null;
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [List, setList] = useState([]);
  const [users,setUsers] = useState([])
  useEffect(() => {
    //verificando a altura do scroll, se conteudo maior do que a altura do conteudo
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [List]);

  useEffect(() => {
    setList([])
    let unsub = Api.onChatContent(data.chatId,setList,setUsers)
    return unsub
  }, [data.chatId]);

  function handleMicClick() {
    if (recognition !== null) {
      //escuta
      recognition.onstart = () => {
        setListening(true);
      };
      //finaliza
      recognition.onend = () => {
        setListening(false);
      };
      //transcreve
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };
      recognition.start();
    }
  }
  
  function handleInputKeyUp(e){
    if(e.keyCode === 13){
      handleSendClick()
    }
  }
  function handleSendClick() {
    if(text !== ''){
      Api.sendMessage(data,user.id,'text',text,users)
      setText('')
    }

  }
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-window-info">
          <img className="chat-window-avatar" src={data.image} alt="" />
          <div className="chat-window-name">{data.title}</div>
        </div>

        <div className="chat-window-buttons">
          <div className="chat-window-btn">
            <SearchIcon style={{ color: "#919191" }} />
          </div>
          <div className="chat-window-btn">
            <AttachEmailIcon style={{ color: "#919191" }} />
          </div>
          <div className="chat-window-btn">
            <ModeNightIcon style={{ color: "#919191" }} />
          </div>
          <div className="chat-window-btn">
            <MoreVertIcon style={{ color: "#919191" }} />
          </div>
        </div>
      </div>

      <div ref={body} className="chat-body">
        {List.map((item, key) => (
          <MessageItem key={key} data={item} user={user} />
        ))}
      </div>

      <div className="chat-footer">
        <div className="chat-footer-inputarea">
          <InputEmoji
            className="chat-footer-input"
            value={text}
            onChange={setText}
            cleanOnEnter
            placeholder="Type a message"
            onEnter={handleInputKeyUp}
          />
        </div>
        <div className="chat-footer-pos">
          {text === "" && (
            <div onClick={handleMicClick} className="chat-footer-btn">
              <MicIcon style={{ color: listening ? "#126ece" : "#919191" }} />
            </div>
          )}
          {text !== "" && (
            <div onClick={handleSendClick} className="chat-footer-btn">
              <ArrowUpwardIcon style={{ color: "#919191" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
