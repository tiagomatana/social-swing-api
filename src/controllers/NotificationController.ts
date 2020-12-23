import {io, users} from '../server';
import Logger from "../interfaces/Logger";

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


export default {
    sendNotification(email: string, title: string, content: string, type: string = '') {
        try {
            const notify = new MessageNotification({title, content, type});

            if (!email) {
                io.emit('notifications', notify)
            } else {
                // @ts-ignore
                users[email].emit('notifications', notify);
            }

        } catch (e) {
            Logger.error('Error on notification');
        }

    }
}
