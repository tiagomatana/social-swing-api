import {Router} from "express";
import './database/connection'
import AccountController from "./controllers/AccountController";
import multer from "multer";
import uploadConfig from './config/upload';
import JWT from "./security/JWT";
import ImageController from "@controllers/ImageController";
import LocationController from "@controllers/LocationController";
import ResponseInterface from "./interfaces/ResponseInterface";
import https from 'https'

const prefix = '/api';
const routes = Router();
const upload = multer(uploadConfig);

routes.get(prefix, async (req, res) => {
  const user = await JWT.getUser(req);
  res.send(user ? true : false);
});

routes.post(`${prefix}/accounts`, AccountController.create);
routes.get(`${prefix}/accounts`,JWT.verify, AccountController.index);
routes.put(`${prefix}/accounts`, [JWT.verify, upload.single('photo')], AccountController.update);
routes.delete(`${prefix}/accounts`, JWT.verify, AccountController.deleteAccount);
routes.put(`${prefix}/accounts/disable`, JWT.verify, AccountController.disable);
routes.get(`${prefix}/validate/:token`, AccountController.verifyActivation);
routes.post(`${prefix}/recovery-pass`, AccountController.recoveryPass);
routes.post(`${prefix}/login`, AccountController.login);

routes.post(`${prefix}/gallery`, [JWT.verify, upload.array('images')], ImageController.save);
routes.patch(`${prefix}/gallery`, [JWT.verify], ImageController.remove);

routes.post(`${prefix}/locate`, JWT.verify, LocationController.save);
// routes.get(`${prefix}/timeline`, JWT.verify, LocationController.list);


routes.get(`${prefix}/states`, async function (request, response) {
  const apiRequest = await https.get(new URL('https://servicodados.ibge.gov.br/api/v1/localidades/estados'), function (res) {
    let str = ''
    res.on('data', function (chunk) {
      str += chunk
    });

    res.on('end', function () {
      if (str) {
        const result:any = JSON.parse(str);
        // @ts-ignore
        const states = result.map(({sigla, nome}) => {
          return {sigla, nome}
        })
        return response.status(200).json(states);
      }
      let {code, body} = ResponseInterface.notFound(str)
      return response.status(code).json(body)
    });
  })
  apiRequest.end();
});

routes.get(`${prefix}/states/:UF`, async function (request, response) {
  const {UF} = request.params;
  const apiRequest = await https.get(new URL(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos`), function (res) {
    let str = ''
    res.on('data', function (chunk) {
      str += chunk
    });

    res.on('end', function () {

      if (str){
        const result:any = JSON.parse(str);
        // @ts-ignore
        const cities = result.map(({nome}) => {
          return nome
        })
        return response.status(200).json(cities);
      }
      let {code, body} = ResponseInterface.notFound(str)
      return response.status(code).json(body)
    });
  })
  apiRequest.end()
});

export default routes;
