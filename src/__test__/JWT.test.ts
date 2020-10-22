import JWT from "../security/JWT";

jest.mock('jsonwebtoken')
describe('JWT Test Suite', () => {

  beforeEach(() => {
    process.env.SECRET = 'test'
  })


  test('JWT tests', async (done) => {

    expect(JWT.getSecret()).toEqual('test');

    done()
  })


})


