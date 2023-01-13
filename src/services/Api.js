import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firebase-firestore'
import firebaseConfig from "./firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const dataBase = firebaseApp.firestore();

export default {
  
  facebookAuth: async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile')
    let result = await firebaseApp.auth().signInWithPopup(provider);
    return result
  },
  addUser: async (user) => {
    await dataBase.collection('users').doc(user.id).set({
      name: user.name,
      avatar: user.avatar
    }, { merge: true })
  },
  getContactList: async (userId) => {
    let list = []

    let results = await dataBase.collection('users').get()
    results.forEach(result => {
      let data = result.data()

      if (result.id !== userId) {
        list.push({
          id: result.id,
          name: data.name,
          avatar: data.avatar
        })
      }
    })
    return list
  },
  addNewChat: async (user, SelectedUser) => {
    let newChat = await dataBase.collection('chats').add({
      messages: [],
      users: [user.id, SelectedUser.id]
    })
    dataBase.collection('users').doc(user.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: SelectedUser.name,
        image: SelectedUser.avatar,
        with: SelectedUser.id
      })
    })
    dataBase.collection('users').doc(SelectedUser.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user.name,
        image: user.avatar,
        with: user.id
      })
    })
  },

  onChatList: (userId, setChatList) => {
    return dataBase.collection('users').doc(userId).onSnapshot((doc) => {
      if (doc.exists) {
        let data = doc.data()

        if (data.chats) {
          let chats = [...data.chats];

          //ordenando chats
          chats.sort((a, b) => {
            if (a.lastMessageDate === undefined) {
              return -1;
            }
            if (b.lastMessageDate === undefined) {
              return -1;
            }

            if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
              return 1;
            } else {
              return -1;
            }
          });

          setChatList(chats);
        }
      }
    })
  },

  onChatContent: (chatId, setList, setUsers) => {
    return dataBase.collection('chats').doc(chatId).onSnapshot((doc) => {
      if (doc.exists) {
        let data = doc.data()
        setList(data.messages)
        setUsers(data.users)
      }
    })
  },
  sendMessage: async (chatData, userId, type, body, users) => {

    let currentMessageDate = new Date()

    dataBase.collection('chats').doc(chatData.chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        type,
        author: userId,
        body,
        date: currentMessageDate
      })
    })

    for (let i in users) {
      let dataUsers = await dataBase.collection('users').doc(users[i]).get()
      let dataReceivedUsers = dataUsers.data()

      if (dataReceivedUsers.chats) {
        let chats = [...dataReceivedUsers.chats]

        for (let e in chats) {
          if (chats[e].chatId == chatData.chatId) {
            chats[e].lastMessage = body
            chats[e].lastMessageDate = currentMessageDate
          }
        }
        await dataBase.collection('users').doc(users[i]).update({
          chats
        })
      }
    }
  }
};


