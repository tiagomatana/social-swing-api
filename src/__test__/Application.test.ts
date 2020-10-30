import JWT from "../security/JWT";
import * as typeorm from 'typeorm'
import app, {server} from '../server'
import request from 'supertest'
import {getMongoManager, MongoEntityManager} from "typeorm";

const mockedTypeorm = typeorm as jest.Mocked<typeof typeorm>;
// const mockMongoManager = getMongoManager();


describe('Application Test Suite', () => {

    beforeAll(() => {
        process.env.SECRET = 'test'
        process.env.PORT = '3000'
        process.env.API_URL = 'localhost'
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'info').mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'table').mockImplementation();
    });

    beforeEach(() => {
        mockedTypeorm.createConnection = jest.fn().mockImplementation(() => typeorm.Connection);
        // mockMongoManager.aggregate = jest.fn().mockImplementation(async () => {
        //     return [{}]
        // })
        // jest.spyOn(mockedTypeorm, 'getMongoManager').mockImplementation();
        // @ts-ignore

    })

    afterEach(async (done) => {
        await server.close()
        done()
    });

    // test('JWT tests',  async (done) => {
    //     process.env.SECRET = 'test'
    //     const email = 'test@test.com';
    //     expect(JWT.getSecret()).toEqual('test');
    //     let token = JWT.sign(email)
    //     expect(token).not.toBeNull();
    //     const user = jwt.verify(token, 'test') as {payload: string};
    //     expect(user.payload).toEqual(email)
    //     done()
    // });

    test('unauthorized requests', async (done) => {

        await request(app).get('/api').set('x-access-token', "token").expect(200).then(response => {
            expect(response.body).toEqual(false)
        })
        await request(app).get('/api/accounts').set('x-access-token', "token").expect(401)

        done()
    })

    test('random route test', async (done) => {
        // @ts-ignore
        await request(app).get(`/api/${jasmine.any(String)}`).set('x-access-token', "token").expect(404)
        done()
    });

    test('login', async (done) => {
        const email = 'test@test.com';

        // @ts-ignore
        jest.spyOn(mockedTypeorm.MongoEntityManager.prototype, 'aggregate').mockReturnValue({toArray: () => {
                return [{email}]
            }})
        expect(JWT.getSecret()).toEqual('test');


        let token = JWT.sign(email)
        await request(app).get('/api/accounts').set('x-access-token', token).expect(200).then(res => {
            console.debug(res.body)
        })
        done()
    });

})


