import {Request, Response} from "express";
import https from "https";
import ResponseInterface from "../interfaces/ResponseInterface";


export default {
    async getStates(request: Request, response: Response) {
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
    },
    async getCities(request: Request, response: Response) {
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
        apiRequest.end();
    }
}