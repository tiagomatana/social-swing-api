import {Router} from "express";
import './database/connection'
import AccountController from "./controllers/AccountController";
import multer from "multer";
import uploadConfig from './config/upload';
import JWT from "./security/JWT";
import ImageController from "@controllers/ImageController";

const prefix = '/api';
const routes = Router();
const upload = multer(uploadConfig);

routes.get(prefix, async (req, res) => {
  const user = await JWT.getUser(String(req.headers['x-access-token']));
  res.status(200).json(user ? true : false)
});

routes.post(`${prefix}/accounts`, AccountController.create);
routes.get(`${prefix}/accounts/:id`,JWT.verify, AccountController.index);
routes.put(`${prefix}/accounts`, [JWT.verify, upload.single('photo')], AccountController.update);
routes.delete(`${prefix}/accounts`, JWT.verify, AccountController.deleteAccount);
routes.put(`${prefix}/accounts/disable`, JWT.verify, AccountController.disable);
routes.get(`${prefix}/validate/:token`, AccountController.verify);
routes.post(`${prefix}/recovery-pass`, AccountController.recoveryPass);
routes.post(`${prefix}/login`, AccountController.login);

routes.post(`${prefix}/gallery`, [JWT.verify, upload.array('images')], ImageController.save);

export default routes;
