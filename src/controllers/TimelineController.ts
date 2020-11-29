import {Request, Response} from 'express';
import {getMongoManager} from "typeorm";
import Account from "../models/Account";
import ResponseInterface from "../interfaces/ResponseInterface";
import JWT from "../security/JWT";
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
            const {miles, genre} = request.params
            const mongoManager = getMongoManager();
            const email = await JWT.getUser(request);
            let users = [];
            const account = await AccountController.getLoggedUser(request) as Account;

            if (miles && account.point) {
                users = await mongoManager.aggregate(Account, [
                    {
                        $match: {
                            point: { $geoWithin:   { $centerSphere: [ account.point.coordinates, Number(miles) / 3963.2 ] } }, //111.12
                            email: { $ne: account.email},
                            genre: genre ? genre : { $ne: account?.genre}
                        }
                    }
                ]).toArray();
            } else {
                users = await mongoManager.aggregate(Account, [
                    {
                        $match: {
                            city: account?.city,
                            uf: account?.uf,
                            email: { $ne: email},
                            genre: genre ? genre : { $ne: account?.genre},
                            is_blocked: false,
                            active: false,
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

