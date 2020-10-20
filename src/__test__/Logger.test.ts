import Logger from "../interfaces/Logger";

describe('Logger Interface Test Suite', () => {


  test('Logger info tests', async(done) => {
    spyOn(console, 'info');
    let msg = 'testing info'
    Logger.info(msg)
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching("INFO"))
    expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching(msg))
    done()
  })

  test('Logger error tests', async(done) => {
    spyOn(console, 'error');
    let msg = 'testing error'
    Logger.error(msg)
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching("ERROR"))
    expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(msg))
    done()

  })

  test('Logger log tests', async(done) => {
    spyOn(console, 'log');
    let msg = 'testing log'
    Logger.log(msg)
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching("LOG"))
    expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(msg))
    done()

  })

  test('Logger debug tests', async(done) => {
    spyOn(console, 'debug');
    let msg = 'testing debug'
    Logger.debug(msg)
    expect(console.debug).toHaveBeenCalledTimes(1);
    expect(console.debug).toHaveBeenCalledWith(jasmine.stringMatching("DEBUG"))
    expect(console.debug).toHaveBeenCalledWith(jasmine.stringMatching(msg))
    done()

  })

  test('Logger warn tests', async(done) => {
    spyOn(console, 'warn');
    let msg = 'testing warn'
    Logger.warn(msg)
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching("WARN"))
    expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching(msg))
    done()
  })

  test('Logger table tests', async(done) => {
    spyOn(console, 'table');
    spyOn(console, 'info');
    let msg = {test: 'testing table'}
    Logger.table(msg)
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching("INFO"))
    expect(console.info).toHaveBeenCalledWith(jasmine.stringMatching('Table'))
    expect(console.table).toHaveBeenCalledWith(msg)
    done()
  })
})


