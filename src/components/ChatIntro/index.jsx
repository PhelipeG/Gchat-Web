import './ChatIntro.css'
import IconeLogo from '../../assets/IconeMain.png'

export default function ChatIntro(){
    return(
        <div className='chat-intro'>
            <img src={IconeLogo} alt='logo-chat'/>
            <h1>GChat</h1>
            <h2>Converse com seus amigos a vontade no melhor chat do momento 👥.</h2>
            <p>Powered by Luis G.</p>
        </div>
    )
}