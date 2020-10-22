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

export default {
  async save(request: Request, response: Response) {
    try {
      const {id} = request.body;
      const accountRepository = getRepository(Account);
      const requestImages = request.files as Express.Multer.File[];

      const images = requestImages.map(image => {
        return { path: image.filename }
      });

      const schema = Yup.object().shape({
        id: Yup.number().required(),
        images: Yup.array(Yup.object().shape({
          path: Yup.string().required()
        }))
      });

      const data = {id, images};
      await schema.validate(data, {abortEarly: false});
      const account = accountRepository.create(data)
      await accountRepository.update({id}, account);
      let {code ,body} = ResponseInterface.created(account.images);

      return response.status(code).json(body)
    } catch (e) {
      let {code , body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body)
    }

  }

}

