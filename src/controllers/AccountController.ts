import {Request, Response} from 'express';
import {getMongoManager, getRepository} from "typeorm";
import Account from "../models/Account";
import Image from "../models/Images";
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

//Templates html
const RECOVERY_PASS_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'html', 'recovery.html')).toString();
const ACTIVATE_ACCOUNT_TEMPLATE = fs.readFileSync(path.join(__dirname, '..', 'html', 'activate.html')).toString();



export default {
  async getLoggedUser(request: Request) {
    try {
      const mongoManager = getMongoManager();
      let email = await JWT.getUser(request);
      return await mongoManager.findOne(Account, {email})
    } catch (e) {
      throw new Error(e);
    }
  },
  async index(request: Request, response: Response) {
   try {
     const mongoManager = getMongoManager();
     let user = await JWT.getUser(request);
     const accountFounds = await mongoManager.aggregate(Account,[
       {
         $match: {
           email: user
         }
       },
       {
         $lookup: {
           from: 'images',
           localField: 'email',
           foreignField: 'account_email',
           as: 'images'
         }
       },
       {
         $lookup: {
           from: 'locations',
           localField: 'email',
           foreignField: 'account_email',
           as: 'location'
         }
       }
     ]).toArray();

     let api_host = await getEnv();
     if (accountFounds.length && accountFounds[0].email) {
       let {code, body} = ResponseInterface.success(accounts_view.render(accountFounds[0], api_host))

       return response.status(code).json(body);
     } else {
       let {code, body} = ResponseInterface.notFound()

       return response.status(code).json(body);
     }

   } catch (e) {
     let {code, body} = ResponseInterface.internalServerError(e)
     return response.status(code).json(body);
   }
  },
  async update(request: Request, response: Response) {
    try {
      const mongoManager = getMongoManager();
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        surname: Yup.string().required(),
        email: Yup.string().required(),
        birthdate: Yup.date().required(),
        genre: Yup.string().required(),
        sex_orientation: Yup.string().required(),
        relationship: Yup.string().required(),
        about: Yup.string().required()
      })
      const data: AccountInterface = request.body;
      await schema.validate(data, {abortEarly: false})

      const {name, surname, email, birthdate, genre, sex_orientation, relationship, about} = request.body;
      const accountRepository = getRepository(Account);
      if (!is18(new Date(birthdate))) {
        let {code, body} = ResponseInterface.notAcceptable('only 18 years old.')
        return response.status(code).json(body)
      }
      const account = accountRepository.create({
        name,
        surname,
        email,
        birthdate,
        genre,
        sex_orientation,
        relationship,
        about,
        photo: request.file?.filename || ''
      });

      await mongoManager.updateOne(Account, {email: account.email}, account);

      let {code, body} = ResponseInterface.success(account);
      return response.status(code).json(body);
    } catch (e) {
      let {code, body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body);
    }
  },
  async verifyActivation(request: Request, response: Response) {
    try {
      const mongoManager = getMongoManager();
      const email = await JWT.getUser(request);
      const accountRepository = getRepository(Account);
      const account = await mongoManager.findOne(Account,{email})
      if (account){
        await mongoManager.updateOne(Account,{email}, {active: true})
        return response.sendFile(path.join(__dirname, '..', 'html', 'email-verified.html'))
      } else {
        response.redirect(`${await getEnv()}`)
        return response.status(200).send('');
      }
    } catch (e) {
      let {code, body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body);
    }

  },
  async recoveryPass(request: Request, response: Response) {
    try {
      const mongoManager = getMongoManager();
      const {email} = request.body;
      const accountRepository = getRepository(Account);
      const account = await mongoManager.findOne(Account, {email});
      if (account) {
        let pass = Math.random().toString(36).slice(-10);
        account.password = JWT.hashSync(pass);
        await sendEmailRecoveryPass(account.email, pass);
        await mongoManager.updateOne(Account, {email: account.email}, {password: account.password});
      }
      let {code, body} = ResponseInterface.success();
      return response.status(code).json(body);
    } catch (e) {
      return response.send(ResponseInterface.internalServerError(e))
    }
  },
  async deleteAccount(request: Request, response: Response) {
    try {
      const email = await JWT.getUser(request);
      const accountRepository = getRepository(Account);

      const mongoManager = getMongoManager();

      await accountRepository.delete({email: email});
      await mongoManager.delete(Image, {account_email: email})

      let {code, body } = ResponseInterface.success(true);
      return response.status(code).json(body);
    } catch (e) {
      let {code, body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body);
    }
  },
  async disable(request: Request, response: Response) {
    try {
      const {id} = request.body;
      const accountRepository = getRepository(Account);
      const account = accountRepository.create({id})
      await accountRepository.update({id: account.id}, {active: false});
      let {code, body} = ResponseInterface.success();
      return response.status(code).json(body);
    } catch (e) {
      let {code, body} =ResponseInterface.internalServerError(e);
      return response.status(code).json(body);
    }
  },
  async login(request: Request, response: Response) {
    try {
      const {email, password} = request.body;
      if (!EmailValidator(email)){
        return response.send(ResponseInterface.notAcceptable('Email invalid!'))
      }
      const accountRepository = getRepository(Account);
      const account = await accountRepository.findOne({email});
      if (!account) {
        let {code, body} = ResponseInterface.unauthorized()
        return response.status(code).json(body);
      }
      let valid = JWT.compareSync(password, account.password);
      if (valid) {
        if (!account.active) {
          let {code, body} = ResponseInterface.notAcceptable('Accound disabled')
          return response.status(code).json(body);
        }
        if (account.is_blocked) {
          let {code, body} = ResponseInterface.unauthorized('Accound blocked')
          return response.status(code).json(body);
        }
        let {email} = account
        let token = JWT.sign(email);
        account.last_login = new Date();
        await accountRepository.update({email: account.email}, account);
        let {code, body} = ResponseInterface.success({auth: true, token})
        return response.status(code).json(body)
      } else {
        let {code, body} = ResponseInterface.unauthorized()
        return response.status(code).json(body);
      }
    } catch (e) {
      let {code, body} = ResponseInterface.internalServerError();
      return response.status(code).json(body)
    }

  },
  async create(request: Request, response: Response) {
    try {
      const {
        name,
        surname,
        email,
        birthdate,
        password,
        genre,
          location
      } = request.body;

      if (!is18(new Date(birthdate))) {
        let {code, body} = ResponseInterface.notAcceptable('only 18 years old.')
        return response.status(code).json(body)
      }

      const accountRepository = getRepository(Account);
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        surname: Yup.string().required(),
        email: Yup.string().required(),
        birthdate: Yup.date().required(),
        password: Yup.string().required(),
        genre: Yup.string().required(),
        location: Yup.object<Geolocation>().required()
      })

      const data: AccountInterface = request.body;
      await schema.validate(data, {abortEarly: false})

      const encryptPassword = JWT.hashSync(password);

      if (EmailValidator(email)){
        try {
          const account = accountRepository.create({
            name,
            surname,
            email,
            birthdate: new Date(birthdate),
            password: encryptPassword,
            genre
          })
          await accountRepository.save(account);
          await waitActive(account);
          let {code, body} = ResponseInterface.created(account)
          return response.status(code).json(body);
        } catch (e) {
          let {code, body} = ResponseInterface.notFound('email exists!')
          return response.status(code).json(body)
        }

      } else {
        let {code, body} = ResponseInterface.notAcceptable();
        return response.status(code).json(body);
      }
    } catch (e) {
      let {code, body} = ResponseInterface.internalServerError(e);
      return response.status(code).json(body);
    }


  }
}

async function waitActive(account:Account) {
  try {
    let {email} = account
    let token = JWT.sign(email);
    const api_url = process.env.API_URL as string || 'localhost';
    let link = `${api_url}/api/validate/` + token;
    const data: EmailInterface = {
      email: account.email,
      subject: '[ATIVAR CONTA]',
      body: ACTIVATE_ACCOUNT_TEMPLATE.replace(/linkToActivate/g, link)
    }
    await EmailService.send(data);
    Logger.info(data)
  } catch (e) {
    Logger.error(e)
  }
}

async function sendEmailRecoveryPass(email: string, pass:string) {
  try {
    const data: EmailInterface = {
      email: email,
      subject: '[RECUPERAR SENHA]',
      body: RECOVERY_PASS_TEMPLATE.replace(/password/, pass)
    }
    await EmailService.send(data);
    Logger.info(data)
  } catch (e) {
    Logger.error(e)
  }
}

function is18(birthdate: Date) {
  const today = new Date();
  var years = today.getFullYear() - birthdate.getFullYear();
  const month = today.getMonth() - birthdate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())){
    years--;
  }

  return years >=18;
}

async function getEnv() {
  return await process.env.API_URL as string;
}


