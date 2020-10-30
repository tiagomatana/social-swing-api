import express from 'express';
import 'express-async-errors'
import connection from "./database/connection";
import * as path from "path";
import cors from 'cors';
import errorHandler from "./errors/handler";
import routes from "./routes";
import listEndpoints from 'express-list-endpoints';
const {PORT} = process.env;

const app = express();
connection.create().then();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(routes);


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(errorHandler)

const server = app.listen(PORT || 3000, () => {
  console.info(`[SERVER] Running in port ${PORT || 3000}`)
  let r = listEndpoints(app)
  console.table(r)

});

export {server}
export default app;