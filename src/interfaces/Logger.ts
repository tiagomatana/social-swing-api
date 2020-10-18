export default {
  error: (msg: any) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [ERROR] - ${JSON.stringify(msg)}`;
    console.error(message);
  },
  info: (msg: any) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [INFO] - ${JSON.stringify(msg)}`;
    console.info(message);
  },
  debug: (msg: any) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [DEBUG] - ${JSON.stringify(msg)}`;
    console.debug(message);
  },
  log: (msg: any) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [LOG] - ${JSON.stringify(msg)}`;
    console.log(message);
  },
  warn: (msg: any) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [WARN] - ${JSON.stringify(msg)}`;
    console.warn(message);
  },
  table: (table: object) => {
    const dateLog = new Date().toISOString();
    const message = `[${dateLog}] [INFO] - Table:`;
    console.info(message);
    console.table(table)
  },
}
