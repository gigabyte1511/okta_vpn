import Router from 'koa-router'
import {createClientConfig, deleteClientController, deleteExiredConfigsController, getClientConfigByID, getClientConfigs, listClients } from '../controllers/VPNConfigController'

export const vpnConfigRouter = new Router({
  prefix: `/config`,
})

vpnConfigRouter.post(`/list`, listClients)
vpnConfigRouter.post(`/get`, getClientConfigs)
vpnConfigRouter.post(`/get/id`, getClientConfigByID)
vpnConfigRouter.post(`/create`, createClientConfig)
vpnConfigRouter.post(`/delete`, deleteClientController)
vpnConfigRouter.post(`/expired/delete`, deleteExiredConfigsController)