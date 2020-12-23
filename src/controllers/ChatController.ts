import {io} from "../server";
import {getMongoManager, getRepository} from "typeorm";
import * as Yup from "yup";
import JWT from "../security/JWT";
import ResponseInterface from "../interfaces/ResponseInterface";
import Message from "@models/Message";
import Logger from "../interfaces/Logger";
import {Request, Response} from "express";


export default {
    sendMessages(io: any, socket: any, users: any[]): void {
        socket.on("send message", async function(data: any, callback: any){

            try {
                // const mongoManager = getMongoManager();
                const schema = Yup.object().shape({
                    token: Yup.string().required(),
                    to: Yup.string().required(),
                    msg: Yup.string().required()
                })
                await schema.validate(data, {abortEarly: false});

                var userLogged = JWT.getUserByToken(data.token);
                if (userLogged != null) {
                    data.from = userLogged;
                    const messageRepository = getRepository(Message);
                    const message = messageRepository.create(data);
                    await messageRepository.save(message);
                    // await mongoManager.insertOne(Message, message)
                    // @ts-ignore
                    users[userLogged].emit("update messages", message);
                }
                callback();
            } catch (e) {
                Logger.error(ResponseInterface.internalServerError(e))

            }
        });
    },
    async getMessages(request: Request, response: Response){
        try {
            const mongoManager = getMongoManager();
            const userEmail = JWT.getUser(request);
            const {email} = request.params;

            if (email) {
                const messages: Message[] = await mongoManager.aggregate(Message, [
                    {
                        $match: {from: String(userEmail), to: email}
                    },
                    {
                        $match: {from: email, to: String(userEmail)}
                    }
                ]).toArray();

                let {code, body} = ResponseInterface.success(messages);
                return response.status(code).json(body);
            } else {
                let {code, body} = ResponseInterface.success([]);
                return response.status(code).json(body);
            }

        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body);
        }
    }
}
