import {Request, Response} from 'express';
import {getRepository} from "typeorm";
import Account from "../models/Account";
import del from 'del';
import path from 'path';
import ResponseInterface from "../interfaces/ResponseInterface";
import JWT from "../security/JWT";
import Image from "@models/Images";

export default {
  async save(request: Request, response: Response) {
    try {
      const email = await JWT.getUser(request);
      const accountRepository = getRepository(Account);
      const account = await accountRepository.findOneOrFail({email})
      const imageRepository = getRepository(Image);
      const requestImages = request.files as Express.Multer.File[];

      const images = requestImages.map(image => {
        return { path: `${image.filename}`, account_email: account.email }
      });

      const gallery = await imageRepository.create(images);
      account.images = gallery

      await imageRepository.save(gallery);
      let {code ,body} = ResponseInterface.created(account);

      return response.status(code).json(body)
    } catch (e) {
      let {code , body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body)
    }

  },
  async remove(request: Request, response: Response) {
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

