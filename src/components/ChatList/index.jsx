import { useEffect, useState } from "react";
import "./ChatListItem.css";

export default function ChatListItem({ onClick, active, data }) {

  const [time, setTime] = useState("");

  useEffect(() => {

    if (data.lastMessageDate > 0) {
      let dataReceived = new Date(data.lastMessageDate.seconds * 1000);
      let hours = dataReceived.getHours();
      let minutes = dataReceived.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? '0' +minutes : minutes
      setTime(`${hours}:${minutes}`)
    }

  }, [data]);

  return (
    <div
      className={`chat-list-item ${active ? 'active' : ""}`}
      onClick={onClick}
    >
      <img className="chat-list-avatar" src={data.image} />
      <div className="chat-list-lines">
        <div className="chat-list-line">
          <div className="chat-list-name">{data.title}</div>
          <div className="chat-list-date">{time}</div>
        </div>
        <div className="chat-list-line">
          <div className="chat-list-lastmensage">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
