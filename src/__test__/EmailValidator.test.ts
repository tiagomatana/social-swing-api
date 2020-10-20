import EmailValidator from "../utils/EmailValidator";

describe('EmailValidator Test Suite', () => {


  test('validate email tests', async(done) => {
    let email = "test@test.com"
    expect(EmailValidator(email)).toEqual(true);
    expect(EmailValidator('')).toEqual(false);


    done()
  })


})


