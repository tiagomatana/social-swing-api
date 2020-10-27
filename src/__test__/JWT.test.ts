import JWT from "../security/JWT";
import jwt from 'jsonwebtoken'

describe('JWT Test Suite', () => {

  beforeEach(() => {
    process.env.SECRET = 'test'
  })

  test('JWT tests',  async (done) => {
    process.env.SECRET = 'test'
    const email = 'test@test.com';
    expect(JWT.getSecret()).toEqual('test');
    let token = JWT.sign(email)
    expect(token).not.toBeNull();
    const user = jwt.verify(token, 'test') as {payload: string};
    expect(user.payload).toEqual(email)
    done()
  })


})


