import {Request, Response} from "express";
import https from "https";
import ResponseInterface from "../interfaces/ResponseInterface";
import {io} from '../server';

interface ClientConnection {
    id: string;
    customId: string;
}

class MessageNotification {
    title: string;
    content: string;
    type: string;

    constructor(data: any) {
        this.title = data.title || 'Social Swing';
        this.content = data.content || '';
        this.type = data.type || 'DEFAULT';
    }
}


const _clientsConnected: any = [];

io.on('connection', (socket) => {
    socket.on('storeClientInfo', (data: ClientConnection) => {
        let clientInfo = {
            clientId: data.id,
            customId: data.customId
        }
        _clientsConnected.push(clientInfo);
    });

    socket.on('disconnect', function () {
        for( var i=0, len=_clientsConnected.length; i<len; ++i ){
            var c = _clientsConnected[i];
            if(c.clientId == socket.id){
                _clientsConnected.splice(i,1);
                break;
            }
        }
    });

    //TODO: implementar segurança
    if (!socket.handshake.headers.origin) {
        setTimeout(() => socket.disconnect(true), 5000);
    } else {
        console.log('Socket: client connected');
    }

})

export default {
    sendNotification(email: string, title: string, content: string, type: string) {
        try {
            const notify = new MessageNotification({title, content, type});
            const destination = _clientsConnected.find( (client: ClientConnection) => {
                return client.customId === email
            });
            io.to(destination).emit('notifications', notify);
            return { destination, notify};
        } catch (e) {
            return null
        }

    }
}
