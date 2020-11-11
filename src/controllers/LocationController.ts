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

    },
    async listByMiles(request: Request, response: Response) {
        try {
            const {miles} = request.params
            const mongoManager = getMongoManager();
            const email = await JWT.getUser(request);
            const userLocation = await mongoManager.findOne(Location, {account_email: email})
            if (!userLocation) {
                return await this.listByCity(request, response);
            }
            const users = await mongoManager.aggregate(Location, [
                {
                    $match: {
                        point: { $geoWithin:   { $centerSphere: [ userLocation?.point.coordinates, Number(miles) / 3963.2 ] } }, //111.12
                        account_email: { $ne: userLocation?.account_email}
                    }
                },
                {
                    $lookup: {
                        from: 'accounts',
                        localField: 'account_email',
                        foreignField: 'email',
                        as: 'account'
                    }
                }
            ]).toArray();

            let {code, body} = ResponseInterface.success(users);
            return response.status(code).json(body)
        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body)
        }
    },
    async listByCity(request: Request, response: Response) {
        try {
            const mongoManager = getMongoManager();
            const email = await JWT.getUser(request);
            const account = await AccountController.getLoggedUser(request)
            const users = await mongoManager.aggregate(Account, [
                {
                    $match: {
                        city: account?.city,
                        uf: account?.uf,
                        email: { $ne: email}
                    }
                }
            ]).toArray();

            let {code, body} = ResponseInterface.success(users);
            return response.status(code).json(body)
        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body)
        }
    }


}

