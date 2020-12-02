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

            let match: any = {};
            match.email = { $ne: account.email};
            match.genre = genre ? genre : { $ne: null};
            match.is_blocked = false;
            match.active = false;

            if (miles && account.point) {
                match.point = { $geoWithin:   { $centerSphere: [ account.point.coordinates, Number(miles) / 3963.2 ] } };//111.12

                users = await mongoManager.aggregate(Account, [
                    {
                        $match: match
                    }
                ]).toArray();
            } else {
                match.uf = account.uf;
                match.city = account.city;
                users = await mongoManager.aggregate(Account, [
                    {
                        $match: match
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

