import ResponseInterface from "../interfaces/ResponseInterface";

describe('Logger Interface Test Suite', () => {


  test('Response success with body tests', async(done) => {
    spyOn(console, 'info');
    let msg = 'success'
    let result = ResponseInterface.success(msg);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(200);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response success without body tests', async(done) => {
    spyOn(console, 'info');
    let result = ResponseInterface.success();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(200);
    expect(result.body).toEqual({data: true});
    done()
  })

  test('Response created with body tests', async(done) => {
    spyOn(console, 'info');
    let msg = 'created'
    let result = ResponseInterface.created(msg);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(201);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response created without body tests', async(done) => {
    spyOn(console, 'info');
    let result = ResponseInterface.created();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(201);
    expect(result.body).toEqual({data: true});
    done()
  })

  test('Response notAcceptable with body tests', async(done) => {
    spyOn(console, 'warn');
    let msg = 'notAcceptable'
    let result = ResponseInterface.notAcceptable(msg);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(406);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response notAcceptable without body tests', async(done) => {
    spyOn(console, 'warn');
    let result = ResponseInterface.notAcceptable();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(406);
    expect(result.body).toEqual({data: "Value not acceptable"});
    done()
  })

  test('Response internalServerError with body tests', async(done) => {
    spyOn(console, 'error');
    let msg = 'internalServerError'
    let result = ResponseInterface.internalServerError(msg);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(500);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response internalServerError without body tests', async(done) => {
    spyOn(console, 'error');
    let result = ResponseInterface.internalServerError();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(500);
    expect(result.body).toEqual({data: "There was an error. Please try again later."});
    done()
  })

  test('Response notFound with body tests', async(done) => {
    spyOn(console, 'info');
    let msg = 'notFound'
    let result = ResponseInterface.notFound(msg);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(404);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response notFound without body tests', async(done) => {
    spyOn(console, 'info');
    let result = ResponseInterface.notFound();
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(404);
    expect(result.body).toEqual({data: "Data not found"});
    done()
  })

  test('Response unauthorized with body tests', async(done) => {
    spyOn(console, 'error');
    let msg = 'unauthorized'
    let result = ResponseInterface.unauthorized(msg);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(401);
    expect(result.body).toEqual({data: msg});
    done()
  })

  test('Response unauthorized without body tests', async(done) => {
    spyOn(console, 'error');
    let result = ResponseInterface.unauthorized();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(result.code).toEqual(401);
    expect(result.body).toEqual({data: "Request unauthorized."});
    done()
  })

})


