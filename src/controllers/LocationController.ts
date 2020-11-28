import {Request, Response} from 'express';
import {getMongoManager, getRepository} from "typeorm";
import Account from "../models/Account";
import del from 'del';
import path from 'path';
import ResponseInterface from "../interfaces/ResponseInterface";
import JWT from "../security/JWT";
import Image from "@models/Images";
import * as Yup from "yup";
import AccountInterface from "../interfaces/AccountInterface";
import Location from "@models/Location";
import AccountController from "@controllers/AccountController";

interface LocationInterface {
    city: string;
    miles: number;
    latitude: number;
    longitude: number;
}

export default {
    async save(request: Request, response: Response) {
        try {
            const mongoManager = getMongoManager();

            const email = await JWT.getUser(request);
            const data: LocationInterface = request.body;

            let schema;
            if (data.latitude || data.longitude) {
                schema = Yup.object().shape({
                    latitude: Yup.string().required(),
                    longitude: Yup.string().required()
                });
            } else {
                schema = Yup.object().shape({
                    city: Yup.string().required()
                });
            }
            await schema.validate(data, {abortEarly: false});

            const locationRepository = getRepository(Location);
            const point = locationRepository.create({
                account_email: email,
                point: {
                    coordinates: [data.latitude, data.longitude] || []
                }
            });

            await mongoManager.updateOne(Location, {account_email: email}, point, {upsert: true});

            let {code, body} = ResponseInterface.created(point);

            return response.status(code).json(body)
        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body)
        }

    }


}

