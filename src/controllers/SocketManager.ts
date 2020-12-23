import {io, users} from '../server';
import ChatController from "@controllers/ChatController";
import JWT from "../security/JWT";


const history_messages: any[] = []; // Lista com ultimas mensagens enviadas no chat


io.on("connection", async function(socket){
    // Método de resposta ao evento de entrar

    socket.on("login", async function(token:string, callback:any){
        let email = await JWT.getUserByToken(token) as string;

        if(!(email in users)){
            socket.email = email;
            // @ts-ignore
            users[email] = socket; // Adicionadno o nome de usuário a lista armazenada no servidor

            callback(true);
        }else{
            callback(false);
        }
    });

    ChatController.sendMessages(io, socket, users);

    socket.on("disconnect", function(){
        delete users[socket.email];
    });

});
