import Enum from "../utils/Enum";

describe('Enum Test Suite', () => {


  test('Enum tests', async(done) => {
    expect(Enum.ADMINISTRATOR).toEqual('administrador');
    expect(Enum.USER).toEqual('usuario');
    done()
  })


})


