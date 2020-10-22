import {Request, Response} from 'express';
import {getRepository} from "typeorm";
import Account from "../models/Account";
import accounts_view from "../views/accounts_view";
import path from 'path';
import fs from 'fs';
import * as Yup from 'yup';

import EmailValidator from "../utils/EmailValidator";
import ResponseInterface from "../interfaces/ResponseInterface";
import AccountInterface from "../interfaces/AccountInterface";
import JWT from "../security/JWT";
import Logger from "../interfaces/Logger";
import EmailService from "../services/EmailService";
import EmailInterface from "../interfaces/EmailInterface";
import retryTimes = jest.retryTimes;
import Image from "@models/Images";

export default {
  async save(request: Request, response: Response) {
    try {
      const {id} = request.body;
      const accountRepository = getRepository(Account);
      const imageRepository = getRepository(Image);
      const requestImages = request.files as Express.Multer.File[];

      const images = requestImages.map(image => {
        return { path: image.filename }
      });

      const schema = Yup.object().shape({
        id: Yup.number().required(),
        images: Yup.array(Yup.object().shape({
          id: Yup.number().required(),
          path: Yup.string().required()
        }))
      });

      const data = {id, images};
      await schema.validate(data, {abortEarly: false});
      const account = accountRepository.create(data)

      await imageRepository.query('DELETE FROM images WHERE account_id = $1', [id]);

      await accountRepository.update({id}, account);
      let {code ,body} = ResponseInterface.created(account.images);

      return response.status(code).json(body)
    } catch (e) {
      let {code , body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body)
    }

  },
  async remove(request: Request, response: Response) {
    try {
      const {images} = request.body;
      const imageRepository = getRepository(Image);
      const selectedImages = imageRepository.create(images);
      let ids = selectedImages.map(image => {
        return image.id;
      })
      await imageRepository.query('DELETE FROM images WHERE id in ($1)', [ids])
    } catch (e) {
      let {code , body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body)
    }
  }

}

