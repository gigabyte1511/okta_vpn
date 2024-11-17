import { exec } from 'child_process'
import { ParameterizedContext } from 'koa';
import Koa from 'koa'
import Router from 'koa-router'
import { VPNConfigRequestPayload } from '../types';
import path from 'path'
import fs from 'fs/promises';
import util from 'util';


const execPromise = util.promisify(exec);

export async function getClientConfig( appContext: ParameterizedContext<
  Koa.DefaultState,
  Router.IRouterParamContext<Koa.DefaultState, object>
>,){
  const body = appContext.request.body as VPNConfigRequestPayload  
  console.log(body) 
  const clientId = body.clientId
  if (!clientId) {
      appContext.status = 400;
      appContext.body = { error: 'Client name is required' };
      return;
  }
  try {
       const basePath = '/etc/ipsec.d';
       const extensions = ['.p12', '.sswan', '.mobileconfig'];
       const files = extensions.map(ext => path.join(basePath, `${clientId}${ext}`));

       const fileContents: Record<string, string> = {};
       for (const filePath of files) {
         const contentBuffer = await fs.readFile(filePath);
         fileContents[path.basename(filePath)] = contentBuffer.toString('base64');
       }
  
      appContext.body = {
        message: `Client "${clientId}" exported successfully.`,
        files: fileContents
      };
    } catch (error) {
      appContext.status = 500;
      appContext.body = { error: error.message };
    }
}

export async function createClientConfig(
  appContext: ParameterizedContext<
    Koa.DefaultState,
    Router.IRouterParamContext<Koa.DefaultState, object>
  >
) {
  const body = appContext.request.body as VPNConfigRequestPayload;
  const clientId = body.clientId;

  if (!clientId) {
    appContext.status = 400;
    appContext.body = { error: 'Client name is required' };
    return;
  }

  try {
    const addClientCommand = `docker exec vpn ikev2.sh --addclient ${clientId}`;
    await execPromise(addClientCommand);

    const basePath = '/etc/ipsec.d'; 
    const extensions = ['.p12', '.sswan', '.mobileconfig'];
    const files = extensions.map(ext => path.join(basePath, `${clientId}${ext}`));

    const fileContents: Record<string, string> = {};
    for (const filePath of files) {
      const contentBuffer = await fs.readFile(filePath); 
      fileContents[path.basename(filePath)] = contentBuffer.toString('base64');
    }

    appContext.body = {
      message: `Client "${clientId}" created and exported successfully.`,
      files: fileContents,
    };
  } catch (error) {
    console.error(error);
    appContext.status = 500;
    appContext.body = { error: error.message };
  }
}

export async function listClients( appContext: ParameterizedContext<
  Koa.DefaultState,
  Router.IRouterParamContext<Koa.DefaultState, object>
>,){
  const body = appContext.request.body as VPNConfigRequestPayload  
  console.log(body) 
  const clientId = body.clientId
  if (!clientId) {
    appContext.status = 400;
    appContext.body = { error: 'Client name is required' };
    return;
  }
  try {
    const command = 'docker exec vpn ikev2.sh --listclients';    
    const { stdout } = await execPromise(command);

    const lines = stdout.trim().split('\n');

    const clientLines = lines.slice(5);

    const filteredLines = clientLines.filter(line => {
      return line.trim() && !line.includes('---') && !line.includes('Total:');
    });

    const clients = filteredLines.map((line) => {
      const [clientName, status] = line.trim().split(/\s{2,}/);
      return {
        clientName,
        valid: status === 'valid',
      };
    });
  
      appContext.body = {
        message: 'List of VPN clients retrieved successfully.',
        clients
      };
    } catch (error) {
      appContext.status = 500;
      appContext.body = { error: error.message };
    }
}

export async function revokeAndDeleteClient(
  appContext: ParameterizedContext<
    Koa.DefaultState,
    Router.IRouterParamContext<Koa.DefaultState, object>
  >
) {
  const body = appContext.request.body as VPNConfigRequestPayload;
  const clientId = body.clientId;

  if (!clientId) {
    appContext.status = 400;
    appContext.body = { error: 'Client name is required' };
    return;
  }

  try {
  const revokeCommand = `docker exec vpn ikev2.sh --revokeclient ${clientId} -y`;
  await execPromise(revokeCommand);

  const deleteCommand = `docker exec vpn ikev2.sh --deleteclient ${clientId} -y`;
  await execPromise(deleteCommand);

    appContext.body = {
      message: `Client "${clientId}" has been revoked and deleted successfully.`,
    };
  } catch (error) {
    console.error(error);
    appContext.status = 500;
    appContext.body = { error: error.message };
  }
}