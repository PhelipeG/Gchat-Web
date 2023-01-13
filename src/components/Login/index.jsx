import Api from "../../services/Api"
import './Login.css'
import LogoMain from '../../assets/IconeMain.png'
import FacebookIcon from '@mui/icons-material/Facebook';

export default function Login({onReceive}){

   async function handleFacebookLogin(){
        let result = await Api.facebookAuth()
        if(result){
            onReceive(result.user)
        } else{
            alert('Erro ao Conectar')
        }
    }
    return(
        <div className="login">
            <img src={LogoMain} alt=""/>
            <h1>GChat</h1>
            <p>Logue no Melhor chat do Momento</p>
            <button onClick={handleFacebookLogin}>
                <FacebookIcon  style={{marginRight:'4px'}}/>
                Logar com Facebook
            </button>
        </div>
    )
}