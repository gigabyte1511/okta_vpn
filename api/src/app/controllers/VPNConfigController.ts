import { exec } from 'child_process'
import { ParameterizedContext } from 'koa';
import Koa from 'koa'
import Router from 'koa-router'
import { VPNConfigRequestPayload } from '../types';
import path from 'path'
import fs from 'fs/promises';
import util from 'util';
import Config from '../models/Config';
import * as yup from 'yup';
import { revokeAndDeleteClient } from '../utils/execCommands';
import { transaction } from 'objection';
import { log } from 'winston';




const execPromise = util.promisify(exec);

export async function getClientConfigs( appContext: ParameterizedContext<
  Koa.DefaultState,
  Router.IRouterParamContext<Koa.DefaultState, object>
>,){
  const body = appContext.request.body as VPNConfigRequestPayload  
  console.log(body) 
  const chatId = body.chatId
  if (!chatId) {
      appContext.status = 400;
      appContext.body = { error: 'Client name is required' };
      return;
  }
  try {
    const configs = await Config.query().where({chat_id: chatId});

    if (!configs.length) {
      appContext.status = 404;
      appContext.body = { error: `Configurations for client "${chatId}" not found.` };
      return;
    }

    const formattedConfigs = configs.map((config) => ({
      name: `${chatId}-${config.id}`,
      files: {
        mobileconfig: config.config_mobileconfig,
        sswan: config.config_sswan,
        p12: config.config_p12,
      },
    }));

    appContext.body = {
      message: `Configs for client with "${chatId}" exported successfully.`,
      configs: formattedConfigs, // Возвращаем массив объектов
    };

    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
  
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      appContext.status = 500;
      appContext.body = {
        details: {
          error: errorMessage,
          syscall: error.syscall,
          path: error.path
        },
      };
    }
}

const schema = yup.object({
  chatId: yup.string().required('Client ID is required'),
  validUntil: yup.date().required('ValidUntil date is required').min(new Date(), 'ValidUntil must be a future date'),
});

export async function createClientConfig(
  appContext: ParameterizedContext<
    Koa.DefaultState,
    Router.IRouterParamContext<Koa.DefaultState, object>
  >
) {
  const body = appContext.request.body as VPNConfigRequestPayload;

  const { chatId, validUntil } = body;

  if (!chatId) {
    appContext.status = 400;
    appContext.body = { error: 'Client name is required' };
    return;
  }
  if (!validUntil) {
    appContext.status = 400;
    appContext.body = { error: 'validUntil date is required' };
    return;
  }
  let trx;
  try {
    await schema.validate(body, { abortEarly: false });
    
    trx = await transaction.start(Config.knex());
    const newConfig = await Config.query(trx).insert({
      chat_id: chatId,
      config_mobileconfig: '',
      config_p12: '',
      config_sswan: '',
      valid_until_date: validUntil,
    })
    const uniqueId = newConfig.id;    
    const uniqueClientName = `${chatId}-${uniqueId}`;    
    
    const addClientCommand = `docker exec vpn ikev2.sh --addclient ${uniqueClientName}`;
    await execPromise(addClientCommand);

    const basePath = '/etc/ipsec.d'; 
    const extensions = ['.p12', '.sswan', '.mobileconfig'];
    const files = extensions.map(ext => path.join(basePath, `${uniqueClientName}${ext}`));

    const fileContents: Record<string, string> = {};
    for (const filePath of files) {
      const contentBuffer = await fs.readFile(filePath); 
      fileContents[path.basename(filePath)] = contentBuffer.toString('base64');
    }

    const test = await Config.query(trx).findById(uniqueId).patch({
      config_p12: fileContents[`${uniqueClientName}.p12`],
      config_sswan: fileContents[`${uniqueClientName}.sswan`],
      config_mobileconfig: fileContents[`${uniqueClientName}.mobileconfig`],
    });    

    for (const filePath of files) {
      await fs.unlink(filePath); 
    }

    await trx.commit();

    appContext.body = {
      message: `Config "${uniqueClientName}" created and exported successfully.`,
      config:
        {
          name: uniqueClientName,
          files: {
            mobileconfig: fileContents[`${uniqueClientName}.mobileconfig`],
            sswan: fileContents[`${uniqueClientName}.sswan`],
            p12: fileContents[`${uniqueClientName}.p12`],
          },
        }
    };
  } catch (error) {        
    if (trx) {
      await trx.rollback()
    }

    let errorMessage = 'An unexpected error occurred.';
    let command = null;
    let details = null;

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.cmd) {
        command = error.cmd;
      }
      if (error.stderr) {
        const match = error.stderr.match(/Error: (.+)/);
        details = match ? match[1] : error.stderr;
      }
    }
    appContext.status = 500;
    appContext.body = {
      error: errorMessage,
      command: command,
      details: details,
    };
  }
}

export async function listClients( appContext: ParameterizedContext<
  Koa.DefaultState,
  Router.IRouterParamContext<Koa.DefaultState, object>
>,){
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
      let errorMessage = 'An unexpected error occurred.';
      let command = null;
      let details = null;
  
      if (error instanceof Error) {
        errorMessage = error.message;
  
        if (error.cmd) {
          command = error.cmd;
        }
        if (error.stderr) {
          const match = error.stderr.match(/Error: (.+)/);
          details = match ? match[1] : error.stderr;
        }
      }
      appContext.status = 500;
      appContext.body = {
        error: errorMessage,
        command: command,
        details: details,
      };
    }
}

export async function deleteClientController(
  appContext: ParameterizedContext<
    Koa.DefaultState,
    Router.IRouterParamContext<Koa.DefaultState, object>
  >
) {
  const body = appContext.request.body as VPNConfigRequestPayload;
  const chatId = body.chatId;

  if (!chatId) {
    appContext.status = 400;
    appContext.body = { error: 'Client name is required' };
    return;
  }

  try {
    const clientConfigs = await Config.query().where({chat_id: chatId});
    
    if(!clientConfigs.length){
      appContext.status = 400;
      appContext.body = { error: `Configurations for client "${chatId}" not found.` };
      return;
    }
    for(let config of clientConfigs){
      await revokeAndDeleteClient(`${config.chat_id}-${config.id}`)
    }  
    await Config.query().where({chat_id: chatId}).delete()
    
    appContext.body = {
      message: `Client with chatID "${chatId}" has been revoked and deleted successfully.`,
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred.';
    let command = null;
    let details = null;

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.cmd) {
        command = error.cmd;
      }
      if (error.stderr) {
        const match = error.stderr.match(/Error: (.+)/);
        details = match ? match[1] : error.stderr;
      }
    }
    appContext.status = 500;
    appContext.body = {
      error: errorMessage,
      command: command,
      details: details,
    };
  }
}
export async function deleteExiredConfigsController(appContext: ParameterizedContext<
  Koa.DefaultState,
  Router.IRouterParamContext<Koa.DefaultState, object>
>){
  try{
    const expiredConfigs = await Config.query().where('valid_until_date', '<', new Date().toISOString());
    for (const config of expiredConfigs){
        await revokeAndDeleteClient(`${config.chat_id}-${config.id}`)
    }
    const expiredChatIDs = expiredConfigs.map((config)=> `${config.chat_id}-${config.id}`)
    await Config.query().where('valid_until_date', '<', new Date().toISOString()).delete();
    appContext.body = {
      message: `${expiredChatIDs.length} clients have been deleted.`,
      chatIDs: expiredChatIDs
    };
    
  }
    catch(error){
      let errorMessage = 'An unexpected error occurred.';
      let command = null;
      let details = null;
  
      if (error instanceof Error) {
        errorMessage = error.message;
  
        if (error.cmd) {
          command = error.cmd;
        }
        if (error.stderr) {
          const match = error.stderr.match(/Error: (.+)/);
          details = match ? match[1] : error.stderr;
        }
      }
      appContext.status = 500;
      appContext.body = {
        error: errorMessage,
        command: command,
        details: details,
      };
    }
}