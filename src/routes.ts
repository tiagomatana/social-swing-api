import {Router} from "express";
import './database/connection'
import AccountController from "./controllers/AccountController";
import multer from "multer";
import uploadConfig from './config/upload';
import JWT from "./security/JWT";
import ImageController from "@controllers/ImageController";
import LocationController from "@controllers/LocationController";

const prefix = '/api';
const routes = Router();
const upload = multer(uploadConfig);

routes.get(prefix, async (req, res) => {
  const user = await JWT.getUser(req);
  res.status(200).json(user ? true : false)
});

routes.post(`${prefix}/accounts`, AccountController.create);
routes.get(`${prefix}/accounts`,JWT.verify, AccountController.index);
routes.put(`${prefix}/accounts`, [JWT.verify, upload.single('photo')], AccountController.update);
routes.delete(`${prefix}/accounts`, JWT.verify, AccountController.deleteAccount);
routes.put(`${prefix}/accounts/disable`, JWT.verify, AccountController.disable);
routes.get(`${prefix}/validate/:token`, AccountController.verify);
routes.post(`${prefix}/recovery-pass`, AccountController.recoveryPass);
routes.post(`${prefix}/login`, AccountController.login);

routes.post(`${prefix}/gallery`, [JWT.verify, upload.array('images')], ImageController.save);
routes.patch(`${prefix}/gallery`, [JWT.verify], ImageController.remove);

routes.post(`${prefix}/locate`, JWT.verify, LocationController.save);
routes.get(`${prefix}/locate`, JWT.verify, LocationController.list);

export default routes;
