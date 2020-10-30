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

interface LocationInterface {
  city: string;
  latitude: number;
  longitude: number;
}

export default {
  async save(request: Request, response: Response) {
    try {
      const email = await JWT.getUser(request);
      const data: LocationInterface = request.body;

      if (data.latitude || data.longitude) {
        let schema = Yup.object().shape({
          latitude: Yup.string().required(),
          longitude: Yup.string().required(),
          city: Yup.string()
        });

        await schema.validate(data, {abortEarly: false});

      } else {
        let schema = Yup.object().shape({
          latitude: Yup.string(),
          longitude: Yup.string(),
          city: Yup.string().required()
        });

        await schema.validate(data, {abortEarly: false});

      }

      const locationRepository = getRepository(Location);
      const point = locationRepository.create({
        account_email: email,
        point: {
          coordinates: [data.latitude, data.longitude]
        },
        city: data.city
      });

      const mongoManager = getMongoManager()
      await mongoManager.updateOne(Location, {account_email: email}, point, {upsert: true});

      let {code ,body} = ResponseInterface.created(point);

      return response.status(code).json(body)
    } catch (e) {
      let {code , body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body)
    }

  },
  async list(request: Request, response: Response) {
    const {url} = request.body;
    const image = url.replace(/.+\/uploads\//g, '');
    if (image){
      try {
        const email = await JWT.getUser(request);
        const imageRepository = getRepository(Image);
        await imageRepository.delete({account_email: email, path: image});
        const file = path.join(__dirname, '..', '..', 'uploads', image);
        await del.sync(file);
        let {code, body} = ResponseInterface.success(`${image} deleted.`);
        return response.status(code).json(body)
      } catch (e) {
        let {code, body} = ResponseInterface.internalServerError(e);
        return response.status(code).json(body)
      }
    }

  }



}

