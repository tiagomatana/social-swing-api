import {Request, Response} from 'express';
import {getMongoManager} from "typeorm";
import Account from "../models/Account";
import ResponseInterface from "../interfaces/ResponseInterface";
import JWT from "../security/JWT";
import * as Yup from "yup";

interface LocationInterface {
    city: string;
    uf: string;
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

            const location = {
                city: data.city || "",
                uf: data.uf || "",
                point: {
                    type: 'Point',
                    coordinates: data.latitude && data.longitude ? [ data.latitude, data.longitude ] : []
                }
            }

            await mongoManager.updateOne(Account, {email: email}, location);

            let {code, body} = ResponseInterface.created(location);

            return response.status(code).json(body)
        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body)
        }

    }


}

