import {Request, Response, NextFunction} from "express";
import * as jwt from 'jsonwebtoken';
import ResponseInterface from "../interfaces/ResponseInterface";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);
export default {
  async verify(request: Request, response: Response, next: NextFunction) {
    try {
      let secret = process.env.SECRET as string;
      const token = String(request.headers['x-access-token']);
      if (!token) {
        let result = ResponseInterface.unauthorized();
        return response.status(result.code).json(result.body);
      }
      const user = await jwt.verify(token, secret);
      if (!user) {
        let result = ResponseInterface.unauthorized();
        return response.status(result.code).json(result.body);
      }
      next()
    } catch (e) {
      let result = ResponseInterface.unauthorized();
      response.status(result.code).json(result.body);
    }
  },
  async getUser(request: Request) {
    try {
      let secret = process.env.SECRET as string;
      let token = request.header("x-access-token") as string || request.params.token;
      const user:any = jwt.verify(token, secret);
      return user.payload;
    } catch (e) {
      return null;
    }
  },
  async getUserByToken(token: string) {
    try {
      let secret = process.env.SECRET as string;
      const user:any = jwt.verify(token, secret);
      return user.payload;
    } catch (e) {
      return null;
    }
  },
  getSecret() {
    let secret = process.env.SECRET as string;
    return secret;
  },
  sign(payload: string) {
    let secret = this.getSecret();
    let token = jwt.sign({payload}, secret, {
      expiresIn: '1d'
    })
    return token;
  },
  hashSync(password:string){
    return bcrypt.hashSync(password, salt);
  },
  compareSync(originalPass: string, hashPass: string) {
    return bcrypt.compareSync(originalPass, hashPass)
  }
}
