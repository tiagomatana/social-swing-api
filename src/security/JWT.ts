import {Request, Response, NextFunction} from "express";
import * as jwt from 'jsonwebtoken';
import ResponseInterface from "../interfaces/ResponseInterface";
const secret = process.env.SECRET as string;
export default {
  async verify(request: Request, response: Response, next: NextFunction) {
    try {
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
      let result = ResponseInterface.unauthorized(e);
      response.status(result.code).json(result.body);
    }
  },
  async getUser(token: string) {
    try {
      const user = await jwt.verify(token, secret);
      return user;
    } catch (e) {
      return null;
    }
  },
  getSecret() {
    return secret;
  }
}
