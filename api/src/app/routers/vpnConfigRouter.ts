import Router from 'koa-router'
import {createClientConfig, getClientConfig, listClients, revokeAndDeleteClient } from '../controllers/VPNConfigController'

export const vpnConfigRouter = new Router({
  prefix: `/config`,
})

vpnConfigRouter.post(`/list`, listClients)
vpnConfigRouter.post(`/get`, getClientConfig)
vpnConfigRouter.post(`/create`, createClientConfig)
vpnConfigRouter.post(`/delete`, revokeAndDeleteClient)