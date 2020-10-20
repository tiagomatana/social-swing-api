import JWT from "../security/JWT";

jest.mock('jsonwebtoken')
describe('JWT Test Suite', () => {

  beforeEach(() => {
    process.env.SECRET = 'test'
  })


  test('JWT tests', async (done) => {
    const account = 'test@test.com'

    const token = await JWT.sign(account)
    console.log(token)
    expect(JWT.getSecret()).toEqual('test');

    done()
  })


})


