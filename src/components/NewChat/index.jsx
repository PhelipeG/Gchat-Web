import "./NewChat.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import Api from "../../services/Api";

export default function NewChat({
  user,
  chatList,
  showOpenNewChat,
  setShowChat,
}) {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    const getListContact = async () => {
      if (user !== null) {
        //pegando lista de contatos
        let results = await Api.getContactList(user.id);
        setContactList(results);
      }
    };
    getListContact();
  }, [user]);

  async function addNewChat(SelectedUser) {
    await Api.addNewChat(user, SelectedUser);
    handleClose();
  }
  function handleClose() {
    setShowChat(false);
  }

  return (
    <div className="newchat" style={{ left: showOpenNewChat ? 0 : -415 }}>
      <div className="header-newchat">
        <div className="backbutton-newchat" onClick={handleClose}>
          <ArrowBackIcon style={{ color: "#fff" }} />
        </div>
        <div className="title-newchat">Nova Conversa</div>
      </div>
      <div className="list-newchat">
        {contactList.map((item, key) => (
          <div
            className="item-newchat"
            onClick={() => addNewChat(item)}
            key={key}
          >
            <img className="itemavatar-newchat" src={item.avatar} alt="" />
            <div className="itemname-newchat">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
