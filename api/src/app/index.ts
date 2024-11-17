import Koa from 'koa'
import { vpnConfigRouter } from './routers/vpnConfigRouter'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

app.use(bodyParser())

app.use(vpnConfigRouter.routes())

app.listen(9001, () => {console.log(`>> listening on port ${9001}`)})