import Koa from 'koa'
import { vpnConfigRouter } from './routers/vpnConfigRouter'
import bodyParser from 'koa-bodyparser'
import { Model } from "objection";
import knex from "knex";

const knexConfig = require("../../knexfile");
const knexInstance = knex(knexConfig.development);
Model.knex(knexInstance);

const app = new Koa()

app.use(bodyParser())

app.use(vpnConfigRouter.routes())

app.listen(9001, () => {console.log(`>> listening on port ${9001}`)})