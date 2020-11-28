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
    async list(request: Request, response: Response) {
        try {
            const {miles} = request.params
            const mongoManager = getMongoManager();
            const email = await JWT.getUser(request);
            let users = [];
            const userLocation = await mongoManager.findOne(Location, {account_email: email})

            if (miles && userLocation) {
                users = await mongoManager.aggregate(Location, [
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
            } else {
                const account = await AccountController.getLoggedUser(request)
                users = await mongoManager.aggregate(Account, [
                    {
                        $match: {
                            city: account?.city,
                            uf: account?.uf,
                            email: { $ne: email}
                        }
                    }
                ]).toArray();
            }



            let {code, body} = ResponseInterface.success(users);
            return response.status(code).json(body)
        } catch (e) {
            let {code, body} = ResponseInterface.internalServerError(e);
            return response.status(code).json(body)
        }
    }

}

